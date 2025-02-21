import React, { useEffect, useRef, useState } from "react";
import { SpeechToTextProps } from "./SpeechToText.types";
import "./SpeechToText.css";
import Space from "../Space/Space";
import Title from "../Title/Title";
import Button from "../Button/Button";
import { IconTriangle } from "../../Icon/Icons.bin";
import Paragraph from "../Paragraph/Paragraph";

const SpeechToText: React.FC<SpeechToTextProps> = ({
	buttonText = "Start Speaking",
	onChange,
	placeholder = "Say something...",
	title,
}) => {
	const recognitionRef = useRef<any | null>(null);
	const [isListening, setIsListening] = useState(false);
	const [transcript, setTranscript] = useState("");
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

		const handleResult = (event: SpeechRecognitionEvent) => {
			console.log("Speech recognition event:", event);
			const results = event.results;
			if (results && results.length > 0) {
				const firstResult = results[0];
				const transcript = firstResult[0].transcript;
				const isFinal = firstResult.isFinal;
				console.log("Transcript:", transcript, "Final:", isFinal);
				setTranscript(transcript);
				if (isFinal && onChange) onChange(transcript);
			}
		};

		const handleEnd = () => {
			console.log("Speech recognition ended.");
			if (isListeningRef.current) {
				console.log("Restarting speech recognition.");
				try {
					recognition.start();
				} catch (error) {
					console.error("Error restarting:", error);
				}
			}
		};

		recognition.addEventListener("result", handleResult);
		recognition.addEventListener("start", () =>
			console.log("Speech recognition started."),
		);
		recognition.addEventListener("end", handleEnd);
		recognition.addEventListener("error", (e) =>
			console.error("Speech recognition error:", e),
		);
		return () => {
			recognition.removeEventListener("result", handleResult);
			recognition.removeEventListener("end", handleEnd);
		};
	}, [onChange]);

	const startListening = () => {
		console.log("Starting recognition.");
		setIsListening(true);
		setTranscript("");
		try {
			recognitionRef.current?.start();
		} catch (error) {
			console.error("Error starting:", error);
		}
	};

	const stopListening = () => {
		console.log("Stopping recognition.");
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
		<Space direction="vertical" className="oakd-speech-to-text">
			{title && <Title>{title}</Title>}
			<Space>
				<Button
					onClick={toggleListening}
					type="primary"
					icon={<IconTriangle />}
				>
					{isListening ? "Listening..." : buttonText}
				</Button>
				<Paragraph>{isListening ? "(Speak now)" : ""}</Paragraph>
			</Space>
			{isListening && (
				<>
					<Paragraph>{placeholder}</Paragraph>
					<Title>{transcript}</Title>
				</>
			)}
		</Space>
	);
};

export default SpeechToText;
