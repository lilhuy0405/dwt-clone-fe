import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSearchParams, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { get, isEmpty } from 'lodash';
import { toast } from 'react-toastify';
import Page from '../../layout/Page/Page';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import TableCommon from '../common/ComponentCommon/TableCommon';
import { demoPages } from '../../menu';
import Card, {
	CardActions,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../components/bootstrap/Card';
import Button from '../../components/bootstrap/Button';
import useDarkMode from '../../hooks/useDarkMode';
import CommonForm from '../common/ComponentCommon/CommonForm';
import verifyPermissionHOC from '../../HOC/verifyPermissionHOC';
import { fetchUnitList } from '../../redux/slice/unitSlice';
import NotPermission from '../presentation/auth/NotPermission';
import { toggleFormSlice } from '../../redux/common/toggleFormSlice';
import { changeCurrentPage, fetchKeyList } from '../../redux/slice/keySlice';
import AlertConfirm from '../common/ComponentCommon/AlertConfirm';
import validate from './validate';
import { fetchPositionList } from '../../redux/slice/positionSlice';
import { addResource, deleteResouce, updateResouce } from '../../api/fetchApi';

const Keys = () => {
	const [searchParams] = useSearchParams();
	const text = searchParams.get('text') || '';
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const localtion = useLocation();

	const { darkModeStatus } = useDarkMode();
	const units = useSelector((state) => state.unit.units);
	const positions = useSelector((state) => state.position.positions);
	const keys = useSelector((state) => state.key.keys);
	const currentPage = useSelector((state) => state.key.currentPage);
	const pagination = useSelector((state) => state.key.pagination);

	const handleOpenFormDelete = (data) => dispatch(toggleFormSlice.actions.confirmForm(data));
	const handleOpenForm = (data) => dispatch(toggleFormSlice.actions.openForm(data));
	const handleCloseForm = () => dispatch(toggleFormSlice.actions.closeForm());
	const toggleFormDelete = useSelector((state) => state.toggleForm.confirm);

	const toggleForm = useSelector((state) => state.toggleForm.open);
	const itemEdit = useSelector((state) => state.toggleForm.data);

	const fetch = () => {
		const query = {};
		query.text = text;
		query.page = currentPage;
		query.limit = 10;
		dispatch(fetchKeyList(query));
	};

	useEffect(() => {
		fetch();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch, currentPage, text]);

	useEffect(() => {
		dispatch(fetchUnitList());
		dispatch(fetchPositionList());
	}, [dispatch]);

	const columns = [
		{
			title: 'T??n ch??? s??? key',
			id: 'name',
			key: 'name',
			type: 'text',
			align: 'left',
			isShow: true,
			col: 5,
		},
		{
			title: '????n v???',
			id: 'unit',
			key: 'unit',
			type: 'select',
			align: 'left',
			isShow: true,
			isShowNested: true,
			render: (item) => <span>{item?.unit?.name}</span>,
			options: units,
			fields: [
				{
					title: 'T??n ????n v???',
					id: 'name',
					key: 'name',
					isShow: true,
					name: 'name',
					type: 'text',
				},
				{
					title: 'M?? ????n v???',
					id: 'code',
					key: 'code',
					isShow: true,
					name: 'code',
					type: 'text',
				},
			],
			col: 3,
		},
		{
			title: 'V??? tr??',
			id: 'position',
			key: 'position',
			type: 'select',
			align: 'left',
			isShow: true,
			options: positions,
			render: (item) => <span>{item?.position?.name}</span>,
			isMulti: false,
			col: 4,
		},
		{
			title: 'M?? t???',
			id: 'description',
			key: 'description',
			type: 'textarea',
			align: 'left',
			isShow: true,
		},
		{
			title: 'H??nh ?????ng',
			id: 'action',
			key: 'action',
			align: 'center',
			render: (item) => (
				<>
					<Button
						isOutline={!darkModeStatus}
						color='success'
						isLight={darkModeStatus}
						className='text-nowrap mx-2'
						icon='Edit'
						onClick={() =>
							handleOpenForm({
								...item,
								position: {
									label: item?.position?.name,
									value: item?.position?.id,
								},
							})
						}
					/>
					<Button
						isOutline={!darkModeStatus}
						color='danger'
						isLight={darkModeStatus}
						className='text-nowrap mx-2 '
						icon='Delete'
						onClick={() => handleOpenFormDelete(item)}
					/>
				</>
			),
			isShow: false,
		},
	];

	const setCurrentPage = (page) => {
		dispatch(changeCurrentPage(page));
	};

	const handleSubmitSearch = (searchValue) => {
		if (searchValue.text === '') {
			searchParams.delete('text');
			navigate({
				pathname: localtion.pathname,
			});
		} else {
			navigate({
				pathname: localtion.pathname,
				search: createSearchParams({
					text: searchValue.text,
				}).toString(),
			});
		}
		setCurrentPage(1);
	};

	const handleSubmitForm = async (data) => {
		const newValue = {
			id: get(itemEdit, 'id', null),
			name: data?.name,
			description: data?.description,
			unit_id: data?.unit?.id,
			position_id: data?.position?.id,
			department_id: data?.position?.department?.id,
		};
		if (isEmpty(itemEdit)) {
			try {
				await addResource('/api/keys', newValue);
				toast.success('Th??m ch??? s??? key th??nh c??ng!', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 1000,
				});
				fetch();
				handleCloseForm();
			} catch (error) {
				toast.error('Th??m ch??? s??? key kh??ng th??nh c??ng!', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 1000,
				});
			}
		} else {
			try {
				await updateResouce('/api/keys', newValue);
				toast.success('C???p nh???t ch??? s??? key th??nh c??ng!', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 1000,
				});
				fetch();
				handleCloseForm();
			} catch (error) {
				toast.error('C???p nh???t ch??? s??? key kh??ng th??nh c??ng!', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 1000,
				});
			}
		}
	};

	const handleDelete = async (data) => {
		try {
			await deleteResouce('/api/keys', data?.id);
			toast.success('X??a ch??? s??? key th??nh c??ng!', {
				position: toast.POSITION.TOP_RIGHT,
				autoClose: 1000,
			});
		} catch (error) {
			toast.error('X??a ch??? s??? key kh??ng th??nh c??ng!', {
				position: toast.POSITION.TOP_RIGHT,
				autoClose: 1000,
			});
		}
		fetch();
		handleCloseForm();
	};

	const handleChangeCurrentPage = (searchValue) => {
		setCurrentPage(searchValue.page);
	};

	const handleSubmitNestedForm = async (itemSubmit, model) => {
		switch (model) {
			case 'unit':
				try {
					const response = await addResource('/api/units', itemSubmit);
					await response.data;
					toast.success('Th??m ????n v??? th??nh c??ng!', {
						position: toast.POSITION.TOP_RIGHT,
						autoClose: 1000,
					});
				} catch (error) {
					toast.error('Th??m ????n v??? kh??ng th??nh c??ng!', {
						position: toast.POSITION.TOP_RIGHT,
						autoClose: 1000,
					});
					throw error;
				}
				break;
			default:
				break;
		}
	};

	return (
		<PageWrapper title={demoPages.cauHinh.subMenu.keys.text}>
			<Page container='fluid'>
				{verifyPermissionHOC(
					<>
						<div className='row mb-0'>
							<div className='col-12'>
								<Card className='w-100'>
									<CardHeader>
										<CardLabel icon='VpnKey' iconColor='primary'>
											<CardTitle>
												<CardLabel>Danh s??ch ch??? s??? Key</CardLabel>
											</CardTitle>
										</CardLabel>
										<CardActions>
											<Button
												color='info'
												icon='Add'
												tag='button'
												onClick={() => handleOpenForm(null)}>
												Th??m m???i
											</Button>
										</CardActions>
									</CardHeader>
									<div className='p-4'>
										<TableCommon
											className='table table-modern mb-0'
											columns={columns}
											data={keys}
											onSubmitSearch={handleSubmitSearch}
											onChangeCurrentPage={handleChangeCurrentPage}
											currentPage={parseInt(currentPage, 10)}
											totalItem={pagination?.totalRows}
											total={pagination?.total}
											setCurrentPage={setCurrentPage}
											searchvalue={text}
											isSearch
										/>
									</div>
								</Card>
							</div>
						</div>
						<CommonForm
							show={toggleForm}
							onClose={handleCloseForm}
							handleSubmit={handleSubmitForm}
							item={itemEdit}
							label={itemEdit?.id ? 'C???p nh???t key' : 'T???o key m???i'}
							fields={columns}
							validate={validate}
							size='lg'
							onSubmitNestedForm={handleSubmitNestedForm}
						/>
						<AlertConfirm
							openModal={toggleFormDelete}
							onCloseModal={handleCloseForm}
							onConfirm={() => handleDelete(itemEdit)}
							title='Xo?? ch??? s??? key'
							content='X??c nh???n xo?? ch??? s??? key?'
						/>
					</>,
					['admin'],
					<NotPermission />,
				)}
			</Page>
		</PageWrapper>
	);
};

export default Keys;
