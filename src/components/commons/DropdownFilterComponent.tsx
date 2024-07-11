import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ChangeEvent, RefAttributes } from 'react';
import { ButtonGroup, Dropdown, Form, OverlayTrigger, Tooltip, TooltipProps } from 'react-bootstrap'
import { JSX } from 'react/jsx-runtime';
import { DropdownFilterModel } from '../../models/DropdownFilterModel';

type Props = {
	title: string | null
	data: DropdownFilterModel[]
	params: string[] | undefined
	setParamsFunction: any;
	paramName: string
	style: Object
	defaultAll: boolean
}



export const DropdownFilterComponent = (props: Props) => {

	const allValues: string[] = props.data.map(filter => { return filter.value });
	const defaultLength = props.data.length
	const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { value, checked } = event.target;
		let updatedOptions: string[] = props.params ? [...props.params] : [];
		if (value === "All") {
			if (checked) {
				updatedOptions = allValues;
				props.data.forEach((_c, index) => {
					let box: HTMLInputElement = document.getElementById("filter_" + props.title + "_" + index) as HTMLInputElement;
					box.checked = true;
				})
			}
			else {
				updatedOptions = [];
				props.data.forEach((_, index) => {
					let box: HTMLInputElement = document.getElementById("filter_" + props.title + "_" + index) as HTMLInputElement;
					box.checked = false;
				})
			}
		} else {
			if (checked) {
				updatedOptions.push(value);
				if (updatedOptions.length >= defaultLength) {
					let box: HTMLInputElement = document.getElementById("filter_" + props.title + "_" + "All") as HTMLInputElement;
					box.checked = true;
				}
			} else {
				updatedOptions = updatedOptions.filter((option) => option !== value);
				let box: HTMLInputElement = document.getElementById("filter_" + props.title + "_" + "All") as HTMLInputElement;
				box.checked = false;
			}
		}
		props.setParamsFunction((p: any) => ({ ...p, [props.paramName]: updatedOptions }));
	};

	const renderTooltip = (props: JSX.IntrinsicAttributes & TooltipProps & RefAttributes<HTMLDivElement>) => (
		<Tooltip id="button-tooltip" {...props}>
			Click to Filter
		</Tooltip>
	);

	return (
		<Dropdown as={ButtonGroup} style={props.style}>
			{/* do NOT remove Overlay Trigger */}
			<OverlayTrigger placement="top" delay={{ show: 150, hide: 0 }} overlay={renderTooltip}>
				<Dropdown.Toggle
					className='d-flex align-items-center justify-content-between'
					variant='outline-dark'
					style={{ minWidth: "250px", textAlign: "left", width: "100%", position: 'relative' }}>
					<span style={{ flex: 1, paddingRight: '20px' }}>{props.title ?? "Option"}</span>
					<div style={{
						position: 'absolute',
						left: 'calc(100% - 40px)', 
						height: '100%',
						borderLeft: '1px solid black'
					}}></div>
					<FontAwesomeIcon icon={faFilter} id="dropdown-checkboxes" className="custom-icon" />
				</Dropdown.Toggle>
			</OverlayTrigger>

			<Dropdown.Menu style={{ width: "100%", maxHeight: "270px", overflowY: "auto" }}>
				<Form className='px-3'>
					<Form.Check
						type="checkbox"
						id={'filter_' + props.title + '_' + 'All'}
						label="All"
						value="All"
						onChange={handleCheckboxChange}
						defaultChecked={props.defaultAll}
					/>
					{/* Select Datas here */}
					{props.data.map((filter, index) => (
						<Form.Check
							key={index}
							id={"filter_" + props.title + "_" + index}
							type="checkbox"
							label={filter.label}
							value={filter.value}
							onChange={handleCheckboxChange}
							defaultChecked={filter.defaultChecked}
						/>
					))}
				</Form>
			</Dropdown.Menu>
		</Dropdown>
	);
};

