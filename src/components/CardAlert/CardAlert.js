import React from 'react';
import PropTypes from 'prop-types';
import Card, { CardBody } from '../bootstrap/Card';

const CardAlert = ({ id, label, number, status }) => {
	const _status =
		(status === 1 && 'success') ||
		(status === 2 && 'warning') ||
		(status === 3 && 'danger') ||
		(status === 4 && 'info');
	return (
		<Card key={id} className={`pt-1 pb-1 bg-l10-${_status}`}>
			<CardBody>
				<div className='row g-3 align-items-center'>
					<div className='col d-flex align-items-center'>
						<div className='flex-grow-1 ms-3 d-flex justify-content-between align-items-center'>
							<div className='fw-bold fs-6 mb-0 text-center w-100'>{`${label}${
								number ? `: ${number}` : ''
							}`}</div>
						</div>
					</div>
				</div>
			</CardBody>
		</Card>
	);
};

CardAlert.propTypes = {
	id: PropTypes.number,
	label: PropTypes.string,
	number: PropTypes.number,
	status: PropTypes.number,
};

CardAlert.defaultProps = {
	id: 0,
	label: '',
	number: null,
	status: 0,
};

export default CardAlert;
