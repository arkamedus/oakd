import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AudioInput from "./AudioInput";
import { AudioInputProps } from "./AudioInput.types";

describe("AudioInput Component", () => {
  let props: AudioInputProps;

  beforeEach(() => {
    props = {
      onChange: jest.fn(),
      disabled: false,
    };

    // Mock MediaDevices
    Object.defineProperty(global.navigator, "mediaDevices", {
      value: {
        getUserMedia: jest.fn().mockResolvedValue({}),
      },
      writable: true,
    });

    // Mock MediaRecorder
    global.MediaRecorder = jest.fn().mockImplementation(function (stream) {
      return {
        start: jest.fn(() => {
          this.state = "recording";
        }),
        stop: jest.fn(() => {
          if (this.ondataavailable) {
            const event = { data: new Blob() };
            this.ondataavailable(event);
          }
          this.state = "inactive";
        }),
        ondataavailable: null,
        stream: stream,
        state: "inactive",
      };
    }) as any;

    // Add the static method `isTypeSupported` to the MediaRecorder mock
    (global.MediaRecorder as any).isTypeSupported = jest.fn(() => true);
  });

  const setup = () => render(<AudioInput {...props} />);

  it("should render the AudioInput component", () => {
    setup();
    expect(screen.getByText(/Click to record/i)).toBeInTheDocument();
  });

  it("should start recording when the microphone button is clicked", async () => {
    setup();
    const buttons = screen.getAllByTestId("Button");
    const recordButton = buttons[0];
    fireEvent.click(recordButton);

    await waitFor(() => {
      expect(screen.getByText(/Recording.../i)).toBeInTheDocument();
    });
  });

  it("should stop recording when the button is clicked again", async () => {
    setup();
    const buttons = screen.getAllByTestId("Button");
    const recordButton = buttons[0];

    // Start recording
    fireEvent.click(recordButton);

    await waitFor(() => {
      expect(screen.getByText(/Recording.../i)).toBeInTheDocument();
    });

    // Stop recording
    fireEvent.click(recordButton);

    expect(screen.getByText(/Click to record/i)).toBeInTheDocument();
  });

  it("should disable the component when disabled is true", () => {
    props.disabled = true;
    setup();

    const buttons = screen.getAllByTestId("Button");
    const recordButton = buttons[0];
    expect(recordButton).toBeDisabled();
  });
});