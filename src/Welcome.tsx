import React from 'react';
import Space from './Atom/Space/Space';
import Title from './Atom/Title/Title';
import Paragraph from './Atom/Paragraph/Paragraph';
import Content from "./Layout/Content/Content";

export const Welcome = () => {
	return (
		<div
			className="welcome__container"
			style={{
				position: "absolute",
				top: "0",
				left: "0",
				width: '100vw',
				height: '100vh',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				background: 'linear-gradient(rgb(236 249 245), rgb(244 247 236))',
				color: '#fff',
				textAlign: 'center',
			}}
		>
			<Content pad>
				<Space gap>
					<Title>oakd</Title>
					<Paragraph>
						<em>v2.0.0</em><br/>by <strong>Gordon Goodrum</strong>
					</Paragraph>
				</Space>
				<Space direction="vertical" style={{maxWidth: '600px'}} gap>
					<Paragraph><em>OakFrame Interactive Design & Component Library</em></Paragraph>
					<Paragraph>
						Welcome to **oakd**, a modern and scalable TypeScript component library
						designed for performance, flexibility, and accessibility. Explore our
						extensive suite of components and get started building better user
						interfaces today.
					</Paragraph>
					<Space direction="horizontal" gap>
						<a
							href="https://github.com/arkamedus/components"
							target="_blank"
							style={{
								color: '#007a88',
								textDecoration: 'none',
								borderBottom: '2px solid #007bff',
								fontWeight: '500',
								fontSize:"80%"
							}}
						>
							GitHub Repo →
						</a>
					</Space>
				</Space>
			</Content>
		</div>
	);
};
