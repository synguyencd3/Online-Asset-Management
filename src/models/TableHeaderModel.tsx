export type TableHeaderModel = {
	// Name of the header to be view
	name: string,
	// value of the header, use for function call
	value: string,
	
	sort: boolean,
	direction: boolean;
	isCurrentlySorted: boolean;
	style: Object;
	colStyle: Object;
}