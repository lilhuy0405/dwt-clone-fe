// eslint-disable-next-line import/prefer-default-export
export const handleContentEditable = (e) => {
	if (e.key === 'Enter') {
		e.preventDefault();
		e.target.blur();
	}
};

export const selectAllInlineText = (e) => {
	e.target.focus();
	// e.target.select();
};
