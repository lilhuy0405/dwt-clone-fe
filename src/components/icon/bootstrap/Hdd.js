import * as React from 'react';

function SvgHdd(props) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width='1em'
			height='1em'
			fill='currentColor'
			className='svg-icon'
			viewBox='0 0 16 16'
			{...props}>
			<path d='M4.5 11a.5.5 0 100-1 .5.5 0 000 1zM3 10.5a.5.5 0 11-1 0 .5.5 0 011 0z' />
			<path d='M16 11a2 2 0 01-2 2H2a2 2 0 01-2-2V9.51c0-.418.105-.83.305-1.197l2.472-4.531A1.5 1.5 0 014.094 3h7.812a1.5 1.5 0 011.317.782l2.472 4.53c.2.368.305.78.305 1.198V11zM3.655 4.26L1.592 8.043C1.724 8.014 1.86 8 2 8h12c.14 0 .276.014.408.042L12.345 4.26a.5.5 0 00-.439-.26H4.094a.5.5 0 00-.44.26zM1 10v1a1 1 0 001 1h12a1 1 0 001-1v-1a1 1 0 00-1-1H2a1 1 0 00-1 1z' />
		</svg>
	);
}

export default SvgHdd;
