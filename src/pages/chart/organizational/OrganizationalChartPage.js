import React from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
import styled from 'styled-components';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import { demoPages } from '../../../menu';

const OrganizationalChartPage = () => {
	const StyledNode = styled.div`
		padding: 5px;
		width: 50px;
		height: 50px;
		border-radius: 100%;
		display: inline-block;
		position: absolute;
		border: 2px solid #f3f3f3;
		top: -32px;
		left: 50px;
		z-index: 2;
		background: #ffc0cb;
	`;

	const StyledImg = styled.div`
		display: flex;
		align-items: center;
		justify-content: center;
	`;

	const StyledCard = styled.div`
		padding: 5px;
		display: flex;
		flex-direction: column;
		width: 150px;
		height: 100px;
		display: inline-block;
		border: 1px solid red;
		position: relative;
		background: #fafafa;
		box-shadow: -2px 2px 10px 3px rgba(0, 0, 0, 0.1);
		border-radius: 8px;
	`;
	const TitleCard = styled.div`
		position: relative;
		top: 30px;
	`;

	const card = (props) => (
		<StyledCard>
			<StyledNode>
				<StyledImg>
					<img
						alt='img'
						height={36}
						width={36}
						src='https://cdn-icons-png.flaticon.com/512/149/149071.png'
					/>
				</StyledImg>
			</StyledNode>
			<TitleCard>
				{/* eslint-disable-next-line react/prop-types */}
				<b>{props.name}</b>
			</TitleCard>
			<TitleCard>
				{/* eslint-disable-next-line react/prop-types */}
				<span style={{ fontSize: 13 }}>{props.position}</span>
			</TitleCard>
		</StyledCard>
	);
	return (
		<PageWrapper title={demoPages.companyPage.subMenu.organizational.text}>
			<Page container='fluid'>
				<div className='row'>
					<div className='col-12'>
						<div
							style={{
								width: '100%',
								height: '100%',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								position: 'relative',
								top: '30px',
							}}>
							<Tree
								lineWidth='3px'
								lineColor='green'
								lineHeight='60px'
								lineBorderRadius='0px'
								nodePadding='10px'
								label={card({
									name: 'Tr???n Minh Thao',
									position: 'T???ng Gi??m ?????c',
								})}>
								<TreeNode
									label={card({
										name: 'Nguy???n V??n A',
										position: 'Gi??m ?????c V??ng 1',
									})}>
									<TreeNode
										label={card({
											name: 'Nguy???n V??n B',
											position: 'Tr?????ng ph??ng kinh doanh',
										})}
									/>
									<TreeNode
										label={card({
											name: 'Nguy???n V??n C',
											position: 'Tr?????ng ph??ng Marketing',
										})}
									/>
									<TreeNode
										label={card({
											name: 'Nguy???n V??n D',
											position: 'Tr?????ng ph??ng Brand',
										})}
									/>
									<TreeNode
										label={card({
											name: 'Nguy???n V??n D',
											position: 'Tr?????ng ph??ng Brand',
										})}
									/>
									<TreeNode
										label={card({
											name: 'Nguy???n V??n D',
											position: 'Tr?????ng ph??ng Brand',
										})}
									/>
									<TreeNode
										label={card({
											name: 'Nguy???n V??n D',
											position: 'Tr?????ng ph??ng Brand',
										})}
									/>
									<TreeNode
										label={card({
											name: 'Nguy???n V??n D',
											position: 'Tr?????ng ph??ng Brand',
										})}
									/>
								</TreeNode>
								<TreeNode
									label={card({
										name: 'Nguy???n V??n E',
										position: 'Gi??m ?????c V??ng 2',
									})}>
									<TreeNode
										label={card({
											name: 'Nguy???n V??n F',
											position: 'Tr?????ng ph??ng kinh doanh',
										})}
									/>
									<TreeNode
										label={card({
											name: 'Nguy???n V??n G',
											position: 'Tr?????ng ph??ng Marketing',
										})}
									/>
									<TreeNode
										label={card({
											name: 'Nguy???n V??n H',
											position: 'Tr?????ng ph??ng Brand',
										})}
									/>
								</TreeNode>
							</Tree>
						</div>
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default OrganizationalChartPage;
