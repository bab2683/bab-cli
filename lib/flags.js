function getFlags(args) {
	return args.reduce((list, current) => {
		const flag = current.toLowerCase().match(/^(?:--)([a-z]+)=(\S+)$/i);
		if (flag) {
			list[flag[1]] = flag[2];
		}
		return list;
	}, {});
}

module.exports = {
	getFlags
};
