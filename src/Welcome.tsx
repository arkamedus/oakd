import React from 'react';
import Space from './Atom/Space/Space';
import Title from './Atom/Title/Title';
import Paragraph from './Atom/Paragraph/Paragraph';
import Content from "./Layout/Content/Content";
import Card from "./Atom/Card/Card";
import Aspect from "./Layout/Aspect/Aspect";
import DebugLayer from "./Atom/DebugLayer/DebugLayer";
import Button from "./Atom/Button/Button";
import {CoreIconNameType, IconSliders, IconTypes} from "./Icon/Icons.bin";
import Icon from "./Icon/Icon";
import {ButtonType} from "./Atom/Button/Button.types";
import Row from './Layout/Row/Row';
import Column from "./Layout/Column/Column";

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
				<Space direction="vertical" style={{maxWidth: '720px'}} gap>
					<Paragraph><em>OakFrame Interactive Design & Component Library</em></Paragraph>
					<Paragraph>
						Welcome to <strong>oakd</strong>, a modern and scalable TypeScript React component library
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

					<Card style={{ width:"100%"}}>
						<DebugLayer label={"oakd | oakframe.org"} style={{backgroundColor:"white"}}>
							<Content pad>

								<Space gap direction={"vertical"}>
								<Space gap>
									{['default','primary','warning','danger'].slice(0,16).map((type: ButtonType) => {
										return <Button icon={"Star"} size={"small"} type={type}><Paragraph>{type}</Paragraph></Button>
								})}
									<Button size={"small"} icon={<IconSliders size={"small"}/>}><Paragraph>Button</Paragraph></Button>
									<Button type={"danger"} size={"small"} icon={"Trash"} />
									<Button type={"ghost"} size={"small"} icon={"Triangle"}><Paragraph>ghost</Paragraph></Button>
								</Space>

								<Space direction={"vertical"} gap>
									<Paragraph>svg icons</Paragraph>
									<Space style={{width:"100%"}} gap justify={"between"}>{IconTypes.slice(0,21).map((icon: CoreIconNameType) => {
										return <Icon name={icon} size="small" style={{color:"black"}} />;
									})}<Paragraph><em>and more!</em></Paragraph>
									</Space>
								</Space>
								<Paragraph>row w/ gap & columns</Paragraph>
								<Row gap>
									<Column xs={24}><DebugLayer label={"Col 24"} /></Column>
									<Column xs={12}><DebugLayer label={"Col 12"} /></Column>
									<Column xs={6}><DebugLayer label={"Col 6"} /></Column>

									<Column xs={4}><DebugLayer style={{minWidth:0, overflowX:"hidden"}}/></Column>
									<Column xs={2}><DebugLayer style={{minWidth:0, overflowX:"hidden"}}/></Column>


									{[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1].map(()=>{
										return <Column xs={1}><DebugLayer style={{minWidth:0, overflowX:"hidden"}}/></Column>
									})}

								</Row>
								</Space>
							</Content>
						</DebugLayer>
					</Card>
				</Space>
			</Content>
		</div>
	);
};
