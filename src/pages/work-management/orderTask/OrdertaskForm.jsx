/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/prop-types */
/* eslint-disable no-shadow */
import React, { useState, useEffect, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import SelectComponent from 'react-select';
import { Modal } from 'react-bootstrap';
import { get, isEmpty } from 'lodash';
import moment from 'moment';
import styled from 'styled-components';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import Select from '../../../components/bootstrap/forms/Select';
import { PRIORITIES } from '../../../utils/constants';
import Option from '../../../components/bootstrap/Option';
import Textarea from '../../../components/bootstrap/forms/Textarea';
import Button from '../../../components/bootstrap/Button';
import Card, { CardHeader, CardLabel, CardTitle } from '../../../components/bootstrap/Card';
import { fetchMissionList } from '../../../redux/slice/missionSlice';
import { fetchEmployeeList } from '../../../redux/slice/employeeSlice';
import { addWorktrack, updateWorktrack } from '../../dailyWorkTracking/services';
import verifyPermissionHOC from '../../../HOC/verifyPermissionHOC';
import { fetchAssignTask } from '../../../redux/slice/worktrackSlice';
import { fetchKeyList } from '../../../redux/slice/keySlice';
import Table from './ChildTaskTable';

const customStyles = {
	control: (provided) => ({
		...provided,
		padding: '10px',
		fontSize: '18px',
		borderRadius: '1.25rem',
	}),
};

const Styles = styled.div`
	table {
		border-spacing: 0;
		border: 1px solid black;
		width: 100%;
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

const TableContainerOuter = styled.div`
	width: 100%;
	height: 100%;
	overflow-y: hidden;
	padding-bottom: 20px;
	margin-top: 20px;
	padding-left: 4px;
`;

const TableContainer = styled.div`
	width: 100%;
	height: 100%;
	min-width: 900px;
`;

const OrderTaskForm = ({ show, onClose, item }) => {
	const dispatch = useDispatch();
	const keys = useSelector((state) => state.key.keys);
	const users = useSelector((state) => state.employee.employees);
	const missions = useSelector((state) => state.mission.missions);
	const tasks = useSelector((state) => state.worktrack.tasks);
	const [missionOption, setMissionOption] = useState({});
	const [keyOption, setKeyOption] = useState([]);
	const [parentOption, setParentOption] = useState({});
	const [userOption, setUserOption] = useState({});
	const [checkValidate, setCheckValidate] = useState(false);
	const [mission, setMission] = React.useState({
		quantity: '',
		startDate: moment().add(0, 'days').format('YYYY-MM-DD'),
		deadline: '',
		priority: 2,
		note: '',
		name: '',
	});
	const [data, setData] = React.useState([]);

	useEffect(() => {
		setData(
			item?.children?.map((i) => {
				return {
					id: i?.data?.id,
					kpiNorm_name: i?.data?.name,
					kpi_value: i?.data?.kpi_value,
					manday: i?.data?.manday,
				};
			}),
		);
	}, [item?.children]);

	const updateMyData = (rowIndex, columnId, value) => {
		setData((old) =>
			old.map((row, index) => {
				if (index === rowIndex) {
					return {
						...old[rowIndex],
						[columnId]: value,
					};
				}
				return row;
			}),
		);
	};

	useEffect(() => {
		dispatch(fetchKeyList());
		dispatch(fetchMissionList());
		dispatch(fetchEmployeeList());
		dispatch(fetchAssignTask());
	}, [dispatch]);

	useEffect(() => {
		const dataParent = tasks?.find((ele) => ele.id === item?.parent_id);
		if (dataParent) {
			const userResponsible = dataParent?.users?.find(
				(user) => user.workTrackUsers.isResponsible === true,
			);
			setParentOption({
				...dataParent,
				label: `${get(dataParent, 'kpiNorm.name')} - ${get(userResponsible, 'name')}`,
				value: get(dataParent, 'id'),
			});
		}
	}, [tasks, item]);

	useEffect(() => {
		if (item.id) setMission({ ...item });
		setMissionOption({
			...item.mission,
			label: get(item, 'mission.name'),
			value: get(item, 'mission.name'),
		});
		if (!isEmpty(item?.users)) {
			const userResponsible = item?.users.filter(
				(items) => items?.workTrackUsers?.isResponsible === true,
			);
			setUserOption({
				label: get(userResponsible, '[0].name'),
				value: get(userResponsible, '[0].name'),
				id: get(userResponsible, '[0].id'),
			});
		}
	}, [item]);

	const handleChange = (e) => {
		const { value, name } = e.target;
		setMission({
			...mission,
			[name]: value,
		});
	};

	const handleClose = () => {
		setCheckValidate(false);
		onClose();
		setMission({});
		setMissionOption({});
		setUserOption({});
		setParentOption({});
	};

	const role = localStorage.getItem('roles');
	const userId = localStorage.getItem('userId');

	const [selectedRows, setSelectedRows] = useState([]);

	const handleSubmit = async () => {
		setCheckValidate(true);
		if (!isEmpty(mission.deadline)) {
			if (item.id) {
				const dataValue = {
					parent_id: parentOption?.id || null,
					id: item.id,
					kpiNorm_id: item.kpiNorm_id,
					mission_id: missionOption.id || null,
					key_id: keyOption.id || null,
					quantity: parseInt(mission.quantity, 10) || 1,
					user_id: role.includes('user') ? parseInt(userId, 10) : userOption.id,
					priority: parseInt(mission.priority, 10) || null,
					note: mission.note || null,
					description: item.description || null,
					deadline: mission.deadline || null,
					startDate: mission.startDate || null,
					status: role.includes('user') ? 'pending' : 'accepted',
					name: mission.name || null,
				};
				updateWorktrack(dataValue)
					.then(() => {
						toast.success('C???p nh???t c??ng vi???c th??nh c??ng!', {
							position: toast.POSITION.TOP_RIGHT,
							autoClose: 1000,
						});
						setCheckValidate(false);
						handleClose();
						dispatch(fetchAssignTask());
					})
					.catch((err) => {
						toast.success('C???p nh???t c??ng vi???c th??nh c??ng!', {
							position: toast.POSITION.TOP_RIGHT,
							autoClose: 1000,
						});
						throw err;
					});
			} else {
				const dataValue = {
					parent_id: parentOption?.id || null,
					kpiNorm_id: item.kpiNorm_id,
					mission_id: missionOption.id || null,
					key_id: keyOption.id || null,
					quantity: parseInt(mission.quantity, 10) || 1,
					user_id: role.includes('user') ? parseInt(userId, 10) : userOption.id,
					priority: parseInt(mission.priority, 10) || null,
					note: mission.note || null,
					description: item.description || null,
					deadline: mission.deadline || null,
					startDate: mission.startDate || moment().add(0, 'days').format('YYYY-MM-DD'),
					status: role.includes('user') ? 'pending' : 'accepted',
					name: mission.name || null,
				};
				addWorktrack(dataValue)
					.then((res) => {
						toast.success('Th??m c??ng vi???c th??nh c??ng!', {
							position: toast.POSITION.TOP_RIGHT,
							autoClose: 1000,
						});
						selectedRows.forEach((selectedRow) => {
							addWorktrack({
								parent_id: res.data?.data?.id || null,
								kpiNorm_id: selectedRow.id || null,
								mission_id: res.data?.data?.mission_id || null,
								key_id: res.data?.data?.key_id || null,
								quantity:
									parseInt(selectedRow.quantity, 10) || res.data?.data?.quantity,
								user_id: role.includes('user')
									? parseInt(userId, 10)
									: userOption.id,
								priority:
									parseInt(mission.priority, 10) || res.data?.data?.priority,
								deadline: res.data?.data?.deadline || null,
								startDate: res.data?.data?.startDate,
								status: res.data?.data?.status,
								name: selectedRow.name || null,
							});
						});
						dispatch(fetchAssignTask());
						setCheckValidate(false);
						handleClose();
					})
					.catch((err) => {
						toast.error('Th??m c??ng vi???c th???t b???i !', {
							position: toast.POSITION.TOP_RIGHT,
							autoClose: 1000,
						});
						throw err;
					});
			}
		}
	};

	const EditableCell = ({
		value: initialValue,
		row: { index },
		column: { id },
		updateMyData,
	}) => {
		const [value, setValue] = React.useState(initialValue || '');

		const onChange = (e) => {
			setValue(e.target.value);
		};
		const onBlur = () => {
			updateMyData(index, id, value);
		};
		React.useEffect(() => {
			setValue(initialValue);
		}, [initialValue]);

		return (
			<input value={value} onChange={onChange} onBlur={onBlur} style={{ width: '100%' }} />
		);
	};

	const columnTables = React.useMemo(
		() => [
			{
				id: 'selection',
				accessor: 'selection',
				Header: ({ getToggleAllRowsSelectedProps }) => (
					<div>
						<input type='checkbox' {...getToggleAllRowsSelectedProps()} />
					</div>
				),
				Cell: ({ row }) => (
					<div>
						<input type='checkbox' {...row.getToggleRowSelectedProps()} />
					</div>
				),
			},
			{
				Header: 'T??n ?????nh m???c',
				accessor: 'kpiNorm_name',
				maxWidth: 300,
				minWidth: 300,
			},
			{
				Header: 'T??n nhi???m v???',
				id: 'name',
				accessor: 'name',
				maxWidth: 400,
				minWidth: 400,
				Cell: EditableCell,
			},
			{
				Header: 'Ng??y c??ng',
				accessor: 'manday',
				maxWidth: 100,
				minWidth: 100,
			},
			{
				Header: 'Gi?? tr??? KPI',
				accessor: 'kpi_value',
				maxWidth: 100,
				minWidth: 100,
			},
			{
				Header: 'S??? l?????ng',
				id: 'quantity',
				accessor: 'quantity',
				maxWidth: 50,
				minWidth: 50,
				Cell: EditableCell,
			},
		],
		[],
	);

	return (
		<Modal show={show} onHide={handleClose} centered size='xl'>
			<div className='row px-3'>
				<Card className='px-0 w-100 m-auto'>
					<CardHeader className='py-2'>
						<CardLabel>
							<CardTitle className='fs-4 ml-0'>
								{item?.kpiNorm ? 'Ch???nh s???a nhi???m v??? ' : 'Giao nhi???m v???'}
							</CardTitle>
						</CardLabel>
					</CardHeader>
					<div className='col-12 p-4'>
						<div className='row'>
							<table className='w-100 mb-4 border'>
								<thead>
									<tr>
										<th className='p-3 border text-left'>
											T??n ?????nh m???c lao ?????ng
										</th>
										<th className='p-3 border text-center'>?????nh m???c KPI</th>
										<th className='p-3 border text-center'>S??? l?????ng</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td className='p-3 border text-left'>
											<b>
												{get(item, 'kpiNorm_name')
													? get(item, 'kpiNorm_name')
													: get(mission, 'kpiNorm.name')}
											</b>
										</td>
										<td className='p-3 border text-center'>
											<b>
												{item.id
													? get(item, 'kpiNorm.kpi_value')
													: get(item, 'kpi_value')}
											</b>
										</td>
										<td className='p-3 border text-center'>
											<b>
												{item.id
													? get(item, 'kpiNorm.quantity')
													: get(item, 'quantity')}
											</b>
										</td>
									</tr>
								</tbody>
							</table>
							{/* Thu???c m???c ti??u */}
							<div className='row g-2'>
								<div className='col-12'>
									<FormGroup id='name' label='T??n nhi???m v???'>
										<Input
											name='name'
											placeholder='T??n nhi???m v???'
											onChange={handleChange}
											value={mission.name}
											type='text'
											ariaLabel='T??n nhi???m v???'
											className='border border-2 rounded-0 shadow-none'
										/>
									</FormGroup>
								</div>
								<div className='col-4'>
									<FormGroup id='task' label='Thu???c m???c ti??u'>
										<SelectComponent
											placeholder='Thu???c m???c ti??u'
											value={missionOption}
											defaultValue={missionOption}
											onChange={setMissionOption}
											options={missions}
										/>
									</FormGroup>
								</div>
								<div className='col-4'>
									<FormGroup id='parent' label='Thu???c nhi???m v??? cha'>
										<SelectComponent
											placeholder='Thu???c nhi???m v??? cha'
											value={parentOption}
											defaultValue={parentOption}
											onChange={setParentOption}
											options={tasks.filter(
												(item) => item.id !== parentOption?.id,
											)}
										/>
									</FormGroup>
								</div>
								{verifyPermissionHOC(
									<div className='col-4'>
										<FormGroup id='userOption' label='Ngu???i ph??? tr??ch'>
											<SelectComponent
												style={customStyles}
												placeholder='Ch???n ngu???i ph??? tr??ch'
												value={userOption}
												defaultValue={userOption}
												onChange={setUserOption}
												options={users}
											/>
										</FormGroup>
										<div className='text-danger mt-1'>
											{checkValidate && isEmpty(userOption) && (
												<span className='error'>
													Vui l??ng ch???n ng?????i ph??? tr??ch
												</span>
											)}
										</div>
									</div>,
									['admin', 'manager'],
								)}
								<div className='col-4'>
									<FormGroup id='startDate' label='Ng??y b???t ?????u'>
										<Input
											name='startDate'
											placeholder='Ng??y b???t ?????u'
											onChange={handleChange}
											value={
												mission.startDate ||
												moment().add(0, 'days').format('YYYY-MM-DD')
											}
											type='date'
											ariaLabel='Ng??y b???t ?????u'
											className='border border-2 rounded-0 shadow-none'
										/>
									</FormGroup>
								</div>
								<div className='col-4'>
									<FormGroup id='deadline' label='H???n ng??y ho??n th??nh'>
										<Input
											name='deadline'
											placeholder='H???n ng??y ho??n th??nh'
											onChange={handleChange}
											value={mission.deadline}
											type='date'
											ariaLabel='H???n ng??y ho??n th??nh'
											className='border border-2 rounded-0 shadow-none'
										/>
									</FormGroup>
									<div className='text-danger mt-1'>
										{checkValidate && isEmpty(mission.deadline) && (
											<span className='error'>
												Vui l??ng ??i???n ng??y k???t th??c
											</span>
										)}
									</div>
								</div>
								<div className='col-4'>
									<FormGroup id='priority' label='????? ??u ti??n'>
										<Select
											name='priority'
											ariaLabel='Board select'
											className='border border-2 rounded-0 shadow-none'
											placeholder='????? ??u ti??n'
											onChange={handleChange}
											value={mission.priority || 2}>
											{PRIORITIES.map((priority) => (
												<Option key={priority} value={priority}>
													{`C???p ${priority}`}
												</Option>
											))}
										</Select>
									</FormGroup>
								</div>
								<div className='col-4'>
									<FormGroup id='keys' label='Ch??? s??? key'>
										<SelectComponent
											placeholder='Ch??? s??? key'
											value={keyOption}
											defaultValue={keyOption}
											onChange={setKeyOption}
											options={keys}
										/>
									</FormGroup>
								</div>
								<div className='col-4'>
									<FormGroup id='quantity' label='S??? l?????ng'>
										<Input
											type='text'
											name='quantity'
											onChange={handleChange}
											value={mission.quantity || ''}
											placeholder='S??? l?????ng'
											className='border border-2 rounded-0 shadow-none'
										/>
									</FormGroup>
								</div>
								<div className='col-4'>
									<FormGroup id='unit' label='????n v???'>
										<Input
											disabled
											type='text'
											name='unit'
											value={item?.unit}
											placeholder='????n v???'
											className='border border-2 rounded-0 shadow-none'
										/>
									</FormGroup>
								</div>
							</div>

							{/* Ghi ch?? */}
							<div className='row g-2'>
								<div className='col-12'>
									<FormGroup id='note' label='Ghi ch??'>
										<Textarea
											name='note'
											onChange={handleChange}
											value={mission.note || ''}
											ariaLabel='Ghi ch??'
											placeholder='Ghi ch??'
											className='border border-2 rounded-0 shadow-none'
										/>
									</FormGroup>
								</div>
							</div>
						</div>
						{!isEmpty(data) ? (
							<div className='row'>
								<TableContainerOuter>
									<TableContainer>
										<Styles>
											<Table
												columns={columnTables}
												data={data}
												updateMyData={updateMyData}
												selectedRows={selectedRows}
												setSelectedRows={setSelectedRows}
											/>
										</Styles>
									</TableContainer>
								</TableContainerOuter>
							</div>
						) : null}
					</div>
					<div className='col-12 my-4'>
						<div className='w-100 mt-4 text-center'>
							<Button
								color='danger'
								className='w-15 p-3 m-1'
								type='button'
								onClick={handleClose}>
								????ng
							</Button>
							<Button
								color='primary'
								className='w-15 p-3 m-1'
								type='button'
								onClick={handleSubmit}>
								L??u th??ng tin
							</Button>
						</div>
					</div>
				</Card>
			</div>
		</Modal>
	);
};
export default memo(OrderTaskForm);
