import React from 'react';
import { useMeasure } from 'react-use';

const Footer = () => {
	const [{ height }] = useMeasure();

	const root = document.documentElement;
	root.style.setProperty('--footer-height', `${height}px`);

	return <div />;
};

export default Footer;
