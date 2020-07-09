const Obj = {
	name: {
		address: {
			branch: 123,
		},
	},
};

export function Print() {
	console.log(Obj?.name?.address);
}
