import React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import SpeechToText from "./SpeechToText";
import { SpeechToTextProps } from "./SpeechToText.types";

type RecognitionHandlers = Record<string, ((event?: any) => void) | undefined>;

describe("SpeechToText Component", () => {
  let props: SpeechToTextProps;
  let handlers: RecognitionHandlers;
  let mockRecognition: {
    start: jest.Mock;
    stop: jest.Mock;
    addEventListener: jest.Mock;
    removeEventListener: jest.Mock;
    interimResults: boolean;
    lang: string;
  };

  beforeEach(() => {
    props = {
      buttonText: "Start",
      placeholder: "Speak something...",
      title: "Voice to Text",
      onChange: jest.fn(),
    };

    handlers = {};
    mockRecognition = {
      start: jest.fn(),
      stop: jest.fn(),
      addEventListener: jest.fn((type: string, cb: (event?: any) => void) => {
        handlers[type] = cb;
      }),
      removeEventListener: jest.fn((type: string) => {
        delete handlers[type];
      }),
      interimResults: true,
      lang: "en-US",
    };

    (window as any).SpeechRecognition = jest.fn(() => mockRecognition);
    (window as any).webkitSpeechRecognition = undefined;
  });

  const setup = () => render(<SpeechToText {...props} />);

  it("renders the title and trigger label", () => {
    setup();
    expect(screen.getByText("Voice to Text")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Start" })).toBeInTheDocument();
  });

  it("starts listening when the trigger is clicked", async () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: "Start" }));

    await waitFor(() => {
      expect(mockRecognition.start).toHaveBeenCalled();
      expect(screen.getByText("Listening...")).toBeInTheDocument();
      expect(screen.getByText("(Speak now)")).toBeInTheDocument();
    });
  });

  it("updates the transcript and calls onChange for final results", async () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: "Start" }));

    await act(async () => {
      handlers.result?.({
        results: [
          Object.assign([{ transcript: "Hello world!" }], { isFinal: true }),
        ],
      });
    });

    await waitFor(() => {
      expect(screen.getByText("Hello world!")).toBeInTheDocument();
      expect(props.onChange).toHaveBeenCalledWith("Hello world!");
    });
  });
});
