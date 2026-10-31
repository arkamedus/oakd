import React, { forwardRef, useEffect, useState } from "react";
import { AudioInputProps } from "./AudioInput.types";
import "./AudioInput.css";
import Space from "../Space/Space";
import Button from "../Button/Button";
import Paragraph from "../Paragraph/Paragraph";

/**
 * AudioInput component allows users to record audio and provides play
 * and delete functionality for the recorded audio.
 *
 * @param {AudioInputProps} props - The component props.
 * @returns {JSX.Element} The rendered AudioInput component.
 */
const AudioInput = forwardRef<HTMLButtonElement, AudioInputProps>(
  (
    {
      onChange,
      disabled,
      onClick,
      className,
      children,
      icon = "Microphone",
      variant,
      ...rest
    },
    ref,
  ) => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
      null,
    );

    /**
     * Toggles the recording state and starts/stops audio recording.
     */
    const toggleRecording = async () => {
      if (isRecording) {
        mediaRecorder?.stop();
        setIsRecording(false);
      } else {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const recorder = new MediaRecorder(stream);

        recorder.ondataavailable = (event) => {
          setAudioBlob(event.data);
        };

        recorder.start();
        setMediaRecorder(recorder);
        setIsRecording(true);
      }
    };

    /**
     * Stops the recording and resets the media recorder and audio blob.
     */
    const stopRecording = () => {
      if (mediaRecorder) {
        mediaRecorder.stop();
        setIsRecording(false);
        setMediaRecorder(null);
      }
    };

    /**
     * Resets the audio input state.
     */
    const resetAudioInput = () => {
      setAudioBlob(null);
      stopRecording();
    };

    /**
     * Effect to handle audio change when audioBlob is updated.
     */
    useEffect(() => {
      if (audioBlob) {
        onChange(URL.createObjectURL(audioBlob));
      }
    }, [audioBlob, onChange]);

    return (
      <Space gap direction="vertical" className="audio-input">
        <Space gap>
          <Button
            {...rest}
            ref={ref}
            aria-label={
              rest["aria-label"] ??
              (rest["aria-labelledby"] || children
                ? undefined
                : isRecording
                  ? "Stop recording"
                  : "Start recording")
            }
            icon={icon}
            onClick={(event) => {
              onClick?.(event);
              if (!event.defaultPrevented) void toggleRecording();
            }}
            disabled={disabled}
            variant={variant ?? (isRecording ? "primary" : "default")}
            className={className}
          >
            {children}
          </Button>
          <Paragraph>
            {isRecording ? "Recording..." : "Click to record"}
          </Paragraph>
        </Space>
        {audioBlob && <audio controls src={URL.createObjectURL(audioBlob)} />}
        <Button onClick={resetAudioInput} disabled={disabled}>
          <Paragraph>Reset</Paragraph>
        </Button>
      </Space>
    );
  },
);
AudioInput.displayName = "AudioInput";

export default AudioInput;
