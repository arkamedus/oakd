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
  });

  const setup = () => render(<AudioInput {...props} />);

  it("should render the AudioInput component", () => {
    setup();
    expect(screen.getByText(/Click to record/i)).toBeInTheDocument();
  });

  it("should start recording when the microphone button is clicked", async () => {
    setup();
    const recordButton = screen.getByText(/Click to record/i);
    fireEvent.click(recordButton);

    await waitFor(() => {
      expect(screen.getByText(/Recording.../i)).toBeInTheDocument();
    });
  });

  it("should stop recording when the stop button is clicked", async () => {
    setup();
    const recordButton = screen.getByText(/Click to record/i);
    fireEvent.click(recordButton);

    await waitFor(() => {
      expect(screen.getByText(/Recording.../i)).toBeInTheDocument();
    });

    const stopButton = screen.getByText(/Stop/i);
    fireEvent.click(stopButton);

    expect(screen.getByText(/Click to record/i)).toBeInTheDocument();
  });

  it("should reset the audio input when the reset button is clicked", async () => {
    setup();
    const recordButton = screen.getByText(/Click to record/i);
    fireEvent.click(recordButton);

    await waitFor(() => {
      expect(screen.getByText(/Recording.../i)).toBeInTheDocument();
    });

    const stopButton = screen.getByText(/Stop/i);
    fireEvent.click(stopButton);

    const resetButton = screen.getByText(/Reset/i);
    fireEvent.click(resetButton);

    expect(props.onChange).toHaveBeenCalled();
  });

  it("should disable the component when disabled is true", () => {
    props.disabled = true;
    setup();

    const recordButton = screen.getByText(/Click to record/i);
    expect(recordButton).toBeDisabled();
  });
});
