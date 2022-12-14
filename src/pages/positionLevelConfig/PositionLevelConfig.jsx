import React, { useEffect } from 'react';
import { useLocation, useNavigate, createSearchParams, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import Card, {
	CardActions,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../components/bootstrap/Card';
import Button from '../../components/bootstrap/Button';
import verifyPermissionHOC from '../../HOC/verifyPermissionHOC';
import useDarkMode from '../../hooks/useDarkMode';
import CommonForm from '../common/ComponentCommon/CommonForm';
import validate from './validate';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import { demoPages } from '../../menu';
import Page from '../../layout/Page/Page';
import TableCommon from '../common/ComponentCommon/TableCommon';
import { toggleFormSlice } from '../../redux/common/toggleFormSlice';
import { fetchPositionLevelList, changeCurrentPage } from '../../redux/slice/positionLevelSlice';
import NotPermission from '../presentation/auth/NotPermission';
import Loading from '../../components/Loading/Loading';
import AlertConfirm from '../work-management/mission/AlertConfirm';
import { addResource, deleteResouce, updateResouce } from '../../api/fetchApi';

const PositionLevelConfigPage = () => {
	const { darkModeStatus } = useDarkMode();
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const text = searchParams.get('text') || '';

	const localtion = useLocation();

	const handleOpenFormDelete = (data) => dispatch(toggleFormSlice.actions.confirmForm(data));
	const handleOpenForm = (data) => dispatch(toggleFormSlice.actions.openForm(data));
	const handleCloseForm = () => dispatch(toggleFormSlice.actions.closeForm());
	const toggleForm = useSelector((state) => state.toggleForm.open);
	const toggleFormDelete = useSelector((state) => state.toggleForm.confirm);
	const itemEdit = useSelector((state) => state.toggleForm.data);
	const pagination = useSelector((state) => state.positionLevel.pagination);
	const loading = useSelector((state) => state.positionLevel.loading);
	const positionLevels = useSelector((state) => state.positionLevel.positionLevels);

	const currentPage = useSelector((state) => state.positionLevel.currentPage);

	const setCurrentPage = (page) => {
		dispatch(changeCurrentPage(page));
	};

	const columns = [
		{
			title: 'T??n c???p nh??n s???',
			id: 'name',
			key: 'name',
			type: 'text',
			align: 'left',
			isShow: true,
		},
		{
			title: 'M?? c???p nh??n s???',
			id: 'code',
			key: 'code',
			type: 'text',
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
						onClick={() => handleOpenForm(item)}
					/>
					<Button
						isOutline={!darkModeStatus}
						color='danger'
						isLight={darkModeStatus}
						className='text-nowrap mx-2'
						icon='Trash'
						onClick={() => handleOpenFormDelete(item)}
					/>
				</>
			),
			isShow: false,
		},
	];

	useEffect(() => {
		const query = {};
		query.text = text;
		query.page = currentPage;
		query.limit = 10;
		dispatch(fetchPositionLevelList(query));
	}, [dispatch, currentPage, text]);

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

	const handleChangeCurrentPage = (searchValue) => {
		setCurrentPage(searchValue.page);
	};

	const handleSubmitForm = async (itemSubmit) => {
		if (!itemSubmit.id) {
			try {
				const reponse = await addResource('/api/positionLevels', itemSubmit);
				await reponse.data;
				toast.success('Th??m c???p nh??n s??? th??nh c??ng!', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 1000,
				});
				const query = {};
				query.text = text;
				query.page = 1;
				query.limit = 10;
				dispatch(fetchPositionLevelList(query));
				handleCloseForm();
			} catch (error) {
				toast.error('Th??m c???p nh??n s??? kh??ng th??nh c??ng!', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 1000,
				});
				throw error;
			}
		} else {
			try {
				const reponse = await updateResouce('/api/positionLevels', itemSubmit);
				await reponse.data;
				toast.success('C???p nh???t c???p nh??n s??? th??nh c??ng!', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 1000,
				});
				const query = {};
				query.text = text;
				query.page = currentPage;
				query.limit = 10;
				dispatch(fetchPositionLevelList(query));
				handleCloseForm();
			} catch (error) {
				toast.error('C???p nh???t c???p nh??n s??? kh??ng th??nh c??ng!', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 1000,
				});
				throw error;
			}
		}
	};
	const handleDeletePositionLevel = async (id) => {
		try {
			await deleteResouce('/api/positionLevels', id);
			toast.success('Xo?? c???p nh??n s??? th??nh c??ng!', {
				position: toast.POSITION.TOP_RIGHT,
				autoClose: 1000,
			});
			const query = {};
			query.text = text;
			query.page = 1;
			dispatch(fetchPositionLevelList(query));
			handleCloseForm();
		} catch (error) {
			toast.error('Xo?? c???p nh??n s??? kh??ng th??nh c??ng!', {
				position: toast.POSITION.TOP_RIGHT,
				autoClose: 1000,
			});
			throw error;
		}
	};

	return (
		<PageWrapper title={demoPages.hrRecords.subMenu.positionLevelConfig.text}>
			<Page container='fluid'>
				{loading ? (
					<Loading />
				) : (
					<div>
						{verifyPermissionHOC(
							<>
								<div
									className='row mb-0'
									style={{ maxWidth: '70%', minWidth: '70%', margin: '0 auto' }}>
									<div className='col-12'>
										<Card className='w-100'>
											<div style={{ margin: '24px 24px 0' }}>
												<CardHeader>
													<CardLabel
														icon='SupervisorAccount'
														iconColor='primary'>
														<CardTitle>
															<CardLabel>
																Danh s??ch c???p nh??n s???
															</CardLabel>
														</CardTitle>
													</CardLabel>
													<CardActions>
														<Button
															color='info'
															icon='AddCircleOutline'
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
														data={positionLevels}
														onSubmitSearch={handleSubmitSearch}
														onChangeCurrentPage={
															handleChangeCurrentPage
														}
														currentPage={parseInt(currentPage, 10)}
														totalItem={pagination?.totalRows}
														total={pagination?.total}
														setCurrentPage={setCurrentPage}
														searchvalue={text}
														isSearch
													/>
												</div>
											</div>
										</Card>
									</div>
								</div>
								<CommonForm
									show={toggleForm}
									onClose={handleCloseForm}
									handleSubmit={handleSubmitForm}
									item={itemEdit}
									label={
										itemEdit?.id
											? 'C???p nh???t c???p nh??n s???'
											: 'Th??m m???i c???p nh??n s???'
									}
									fields={columns}
									validate={validate}
								/>
								<AlertConfirm
									openModal={toggleFormDelete}
									onCloseModal={handleCloseForm}
									onConfirm={() => handleDeletePositionLevel(itemEdit?.id)}
									title='Xo?? c???p nh??n s???'
									content={`X??c nh???n xo?? c???p nh??n s??? <strong>${itemEdit?.name}</strong> ?`}
								/>
							</>,
							['admin'],
							<NotPermission />,
						)}
					</div>
				)}
			</Page>
		</PageWrapper>
	);
};

export default PositionLevelConfigPage;
