import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import SpeechToText from "./SpeechToText";
import { SpeechToTextProps } from "./SpeechToText.types";

describe("SpeechToText Component", () => {
  let props: SpeechToTextProps;

  beforeEach(() => {
    props = {
      buttonText: "Start",
      placeholder: "Speak something...",
      title: "Voice to Text",
      onChange: jest.fn(),
    };
  });

  const setup = () => render(<SpeechToText {...props} />);

  it("should render the component", () => {
    const { getByText } = setup();
    expect(getByText("Voice to Text")).toBeInTheDocument();
  });

  it("should start listening when button is clicked", async () => {
    const { getByText } = setup();
    const button = getByText("Start");

    // Mock the SpeechRecognition API
    const mockRecognition = {
      start: jest.fn(),
      stop: jest.fn(),
      onresult: null,
      interimResults: true,
      lang: "en-US",
    };
    (window as any).SpeechRecognition = jest.fn(() => mockRecognition);

    fireEvent.click(button);

    await waitFor(() => {
      expect(mockRecognition.start).toHaveBeenCalled();
      expect(getByText("Listening...")).toBeInTheDocument();
    });
  });

  it("should update transcript on speech recognition result", async () => {
    const { getByText } = setup();
    const button = getByText("Start");

    const mockRecognition = {
      start: jest.fn(),
      stop: jest.fn(),
      onresult: null,
      interimResults: true,
      lang: "en-US",
    };
    (window as any).SpeechRecognition = jest.fn(() => mockRecognition);

    fireEvent.click(button);

    // Simulate a speech recognition result
    setTimeout(() => {
      mockRecognition.onresult({
        results: [[{ transcript: "Hello world!", isFinal: true }]],
      });
    }, 100);

    await waitFor(() => {
      expect(getByText("Hello world!")).toBeInTheDocument();
      expect(props.onChange).toHaveBeenCalledWith("Hello world!");
    });
  });
});
