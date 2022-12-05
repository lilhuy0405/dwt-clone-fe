import COLORS from './enumColors';

const EVENT_STATUS = {
	APPROVED: { name: 'Chấp nhận', color: COLORS.SUCCESS.name },
	PENDING: { name: 'Đang chờ', color: COLORS.WARNING.name },
	CANCELED: { name: 'Đã huỷ', color: COLORS.DANGER.name },
	REJECTED: { name: 'Từ chối', color: COLORS.DARK.name },
};
export default EVENT_STATUS;
