import React, { useEffect, useRef, useState } from "react";
import { SpeechToTextProps } from "./SpeechToText.types";
import "./SpeechToText.css";
import Button from "../Button/Button";
import Icon from "../../Icon/Icon";
import Paragraph from "../Paragraph/Paragraph";

type SpeechRecognitionResultEventLike = {
	results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal?: boolean }>;
};

const SpeechToText: React.FC<SpeechToTextProps> = ({
	buttonText = "Start Speaking",
	listeningText = "Listening...",
	onStartListening,
	onInterimChange,
	onChange,
	disabled = false,
	size = "default",
	className = "",
	style,
}) => {
	const recognitionRef = useRef<any | null>(null);
	const [isListening, setIsListening] = useState(false);
	const isListeningRef = useRef(isListening);
	useEffect(() => {
		isListeningRef.current = isListening;
	}, [isListening]);

	useEffect(() => {
		// @ts-ignore
		const SpeechRecognition =
			(window as any).SpeechRecognition ||
			(window as any).webkitSpeechRecognition ||
			(window as any).mozSpeechRecognition ||
			(window as any).msSpeechRecognition;
		if (SpeechRecognition) {
			recognitionRef.current = new SpeechRecognition();
			recognitionRef.current.interimResults = true;
			recognitionRef.current.lang = "en-US";
		} else {
			console.error("Speech Recognition not supported in this browser.");
		}
	}, []);

	useEffect(() => {
		const recognition = recognitionRef.current;
		if (!recognition) return;

		const handleResult = (event: SpeechRecognitionResultEventLike) => {
			const results = event.results;
			if (results && results.length > 0) {
				const firstResult = results[0];
				const transcript = firstResult[0].transcript;
				const isFinal = firstResult.isFinal;
				onInterimChange?.(transcript);
				if (isFinal && onChange) onChange(transcript);
			}
		};

		const handleEnd = () => {
			if (isListeningRef.current) {
				try {
					recognition.start();
				} catch (error) {
					console.error("Error restarting:", error);
				}
			}
		};

		recognition.addEventListener("result", handleResult);
		recognition.addEventListener("end", handleEnd);
		recognition.addEventListener("error", (e) =>
			console.error("Speech recognition error:", e),
		);
		return () => {
			recognition.removeEventListener("result", handleResult);
			recognition.removeEventListener("end", handleEnd);
		};
	}, [onChange, onInterimChange]);

	const startListening = () => {
		setIsListening(true);
		onStartListening?.();
		onInterimChange?.("");
		try {
			recognitionRef.current?.start();
		} catch (error) {
			console.error("Error starting:", error);
		}
	};

	const stopListening = () => {
		setIsListening(false);
		try {
			recognitionRef.current?.stop();
		} catch (error) {
			console.error("Error stopping:", error);
		}
	};

	const toggleListening = () =>
		isListening ? stopListening() : startListening();

	return (
		<div
			className={["oakd-speech-to-text", className].filter(Boolean).join(" ")}
			style={style}
		>
			<Button
				onClick={toggleListening}
				variant={isListening ? "primary" : "default"}
				icon={
					isListening ? (
						<Icon name="Refresh" spin size={"small"} />
					) : (
						<Icon name="Microphone" size={"small"} />
					)
				}
				disabled={disabled}
				size={size}
			>
				<Paragraph>{isListening ? listeningText : buttonText}</Paragraph>
			</Button>
		</div>
	);
};

export default SpeechToText;
