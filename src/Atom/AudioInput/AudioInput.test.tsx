import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AudioInput from "./AudioInput";
import { AudioInputProps } from "./AudioInput.types";

describe("AudioInput Component", () => {
  let props: AudioInputProps;
  let mockRecorder: {
    start: jest.Mock;
    stop: jest.Mock;
    ondataavailable: null | ((event: { data: Blob }) => void);
    state: string;
  };

  beforeEach(() => {
    props = {
      onChange: jest.fn(),
      disabled: false,
    };

    Object.defineProperty(global.navigator, "mediaDevices", {
      value: {
        getUserMedia: jest.fn().mockResolvedValue({}),
      },
      writable: true,
    });

    global.URL.createObjectURL = jest.fn(() => "blob:recording-preview");

    mockRecorder = {
      start: jest.fn(() => {
        mockRecorder.state = "recording";
      }),
      stop: jest.fn(() => {
        mockRecorder.ondataavailable?.({ data: new Blob(["audio"]) });
        mockRecorder.state = "inactive";
      }),
      ondataavailable: null,
      state: "inactive",
    };

    global.MediaRecorder = jest.fn(() => mockRecorder) as any;
    (global.MediaRecorder as any).isTypeSupported = jest.fn(() => true);
  });

  const renderComponent = () => render(<AudioInput {...props} />);

  it("starts recording after requesting microphone access", async () => {
    renderComponent();

    fireEvent.click(screen.getAllByRole("button")[0]);

    await waitFor(() => {
      expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({
        audio: true,
      });
      expect(mockRecorder.start).toHaveBeenCalled();
      expect(screen.getByText("Recording...")).toBeInTheDocument();
    });
  });

  it("publishes a preview URL when a recording is finished", async () => {
    const { container } = renderComponent();

    const recordButton = screen.getAllByRole("button")[0];
    fireEvent.click(recordButton);
    await screen.findByText("Recording...");
    fireEvent.click(recordButton);

    await waitFor(() => {
      expect(props.onChange).toHaveBeenCalledWith("blob:recording-preview");
      expect(container.querySelector("audio")).toHaveAttribute(
        "src",
        "blob:recording-preview",
      );
      expect(screen.getByText("Click to record")).toBeInTheDocument();
    });
  });

  it("disables recording and reset actions when disabled", () => {
    props.disabled = true;
    renderComponent();

    const [recordButton, resetButton] = screen.getAllByRole("button");
    expect(recordButton).toBeDisabled();
    expect(resetButton).toBeDisabled();

    fireEvent.click(recordButton);
    expect(navigator.mediaDevices.getUserMedia).not.toHaveBeenCalled();
  });
});
