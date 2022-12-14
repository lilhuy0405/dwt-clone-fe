/* eslint-disable no-script-url */
/* eslint-disable react/jsx-no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/prop-types */
import React, { useEffect, memo } from 'react';
import { useDispatch } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { get } from 'lodash';
import styled from 'styled-components';
import { LIST_STATUS } from '../../utils/constants';
import { fetchEmployeeList } from '../../redux/slice/employeeSlice';
import { fetchAssignTask } from '../../redux/slice/worktrackSlice';
import { downloadFileReport } from './services';

const Styles = styled.div`
	table {
		border-spacing: 0;
		border: 1px solid black;
		width: 100%;
		tbody {
			overflow-y: auto;
		}
		tr {
			:last-child {
				td {
					border-bottom: 0;
				}
			}
		}

		th,
		td {
			margin: 0;
			padding: 0.5rem;
			border-bottom: 1px solid black;
			border-right: 1px solid black;

			:last-child {
				border-right: 1px;
			}
		}
	}
`;

const DailyWorktrackInfo = ({ show, onClose, item }) => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchEmployeeList());
		dispatch(fetchAssignTask());
	}, [dispatch]);

	const handleDowloadFile = async (file) => {
		const response = await downloadFileReport(file);
		let filename = file;
		const disposition = get(response.headers, 'content-disposition');
		if (disposition && disposition.indexOf('attachment') !== -1) {
			const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
			const matches = filenameRegex.exec(disposition);
			if (matches != null && matches[1]) {
				filename = matches[1].replace(/['"]/g, '');
			}
		}
		const url = window.URL.createObjectURL(
			new Blob([response.data], { type: get(response.headers, 'content-type') }),
		);
		const link = document.createElement('a');
		link.href = url;
		link.setAttribute('download', filename);
		document.body.appendChild(link);
		link.click();
	};

	return (
		<Modal show={show} onHide={onClose} centered size='xl'>
			<Modal.Header closeButton className='p-4'>
				<Modal.Title>Th??ng tin nhi???m v???</Modal.Title>
			</Modal.Header>
			<Modal.Body className='px-4'>
				<div className='row'>
					<div className='col-12 px-4 pb-4'>
						<h5 className='text-info mb-2'>Th??ng tin ?????nh m???c lao ?????ng</h5>
						<table className='w-100 border'>
							<thead>
								<tr>
									<th className='p-2 border text-left'>T??n ?????nh m???c lao ?????ng</th>
									<th className='p-2 border text-center'>?????nh m???c KPI</th>
									<th className='p-2 border text-center'>S??? l?????ng</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td className='p-2 border text-left'>
										<b>
											{get(item, 'kpiNorm_name')
												? get(item, 'kpiNorm_name')
												: get(item, 'kpiNorm.name')}
										</b>
									</td>
									<td className='p-2 border text-center'>
										<b>
											{item.id
												? get(item, 'kpiNorm.kpi_value')
												: get(item, 'kpi_value')}
										</b>
									</td>
									<td className='p-2 border text-center'>
										<b>
											{item.id
												? get(item, 'kpiNorm.quantity')
												: get(item, 'quantity')}
										</b>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div className='col-12 px-4'>
						<h5 className='text-info mb-2'>Th??ng tin nhi???m v???</h5>
						<table className='w-100 border'>
							<tr>
								<th className='p-2 border text-left'>T??n nhi???m v???</th>
								<td className='p-2 border text-left'>{get(item, 'name')}</td>
							</tr>
							<tr>
								<th className='p-2 border text-left'>Nhi???m v??? cha</th>
								<td className='p-2 border text-left'>
									{get(item, 'parent.name') || get(item, 'parent.kpiNorm.name')}
								</td>
							</tr>
							<tr>
								<th className='p-2 border text-left'>Thu???c m???c ti??u</th>
								<td className='p-2 border text-left'>
									{get(item, 'mission.name')}
								</td>
							</tr>
							<tr>
								<th className='p-2 border text-left'>Ng?????i ph??? tr??ch</th>
								<td className='p-2 border text-left'>{get(item, 'user.name')}</td>
							</tr>
							<tr>
								<th className='p-2 border text-left'>Ng??y b???t ?????u</th>
								<td className='p-2 border text-left'>{get(item, 'startDate')}</td>
							</tr>
							<tr>
								<th className='p-2 border text-left'>H???n ho??n th??nh</th>
								<td className='p-2 border text-left'>{get(item, 'deadline')}</td>
							</tr>
							<tr>
								<th className='p-2 border text-left'>????? ??u ti??n</th>
								<td className='p-2 border text-left'>{`C???p ${
									get(item, 'priority') ? get(item, 'priority') : 1
								}`}</td>
							</tr>
							<tr>
								<th className='p-2 border text-left'>S??? l?????ng</th>
								<td className='p-2 border text-left'>{get(item, 'quantity')}</td>
							</tr>
							<tr>
								<th className='p-2 border text-left'>Ghi ch??</th>
								<td className='p-2 border text-left'>{get(item, 'note')}</td>
							</tr>
						</table>
					</div>
					<div className='col-12 p-4'>
						{/* Tracking c??ng vi???c */}
						<h5 className='text-info mb-2'>Danh s??ch tracking c??ng vi???c</h5>
						<Styles>
							<table>
								<thead>
									<tr>
										<th className='text-center'>Ng??y th???c hi???n</th>
										<th>Tr???ng th??i c??ng vi???c</th>
										<th>Danh s??ch file b??o c??o</th>
									</tr>
								</thead>
								<tbody className='overflow-scroll'>
									{item?.workTrackLogs?.map((log) => (
										<tr>
											<td className='text-center'>{log?.date}</td>
											<td>
												{
													LIST_STATUS.find(
														(st) => st.value === log.status,
													)?.label
												}
											</td>
											<td>
												<ul className='mb-0'>
													{log?.files &&
														JSON.parse(log?.files)?.map((file) => (
															<li key={file}>
																<a
																	href='javascript:void(0)'
																	className=''
																	onClick={() =>
																		handleDowloadFile(file)
																	}>
																	{file}
																</a>
															</li>
														))}
												</ul>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</Styles>
					</div>
				</div>
			</Modal.Body>
		</Modal>
	);
};

export default memo(DailyWorktrackInfo);
