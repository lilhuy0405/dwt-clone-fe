import * as React from 'react';

function SvgArrowBarLeft(props) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width='1em'
			height='1em'
			fill='currentColor'
			className='svg-icon'
			viewBox='0 0 16 16'
			{...props}>
			<path
				fillRule='evenodd'
				d='M12.5 15a.5.5 0 01-.5-.5v-13a.5.5 0 011 0v13a.5.5 0 01-.5.5zM10 8a.5.5 0 01-.5.5H3.707l2.147 2.146a.5.5 0 01-.708.708l-3-3a.5.5 0 010-.708l3-3a.5.5 0 11.708.708L3.707 7.5H9.5a.5.5 0 01.5.5z'
			/>
		</svg>
	);
}

export default SvgArrowBarLeft;
