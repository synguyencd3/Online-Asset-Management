import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ChangeEvent, RefAttributes, useRef } from 'react';
import { ButtonGroup, Dropdown, Form, OverlayTrigger, Tooltip, TooltipProps } from 'react-bootstrap'
import { JSX } from 'react/jsx-runtime';

type Props = {
	title: string | null
	data: { label: string, value: string }[]
	params: string[]
	setParamsFunction: any;
	setDummy: any
}



export const DropdownFilterComponent = (props: Props) => {

	const allValues: string[] = props.data.map(filter => { return filter.value });
	const defaultLength = useRef(props.params.length).current;
	const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {

		const { value, checked } = event.target;
		let updatedOptions: string[] = [...props.params];
		if (value === "All") {
			if (checked) {
				updatedOptions = allValues;
				props.data.forEach((_, index) => {
					let box: HTMLInputElement = document.getElementById("filter_" + index) as HTMLInputElement;
					box.checked = true;
				})
			}
			else {
				updatedOptions = [];
				props.data.forEach((_, index) => {
					let box: HTMLInputElement = document.getElementById("filter_" + index) as HTMLInputElement;
					box.checked = false;
				})
			}
		} else {
			if (checked) {
				updatedOptions.push(value);
				if (updatedOptions.length >= defaultLength) {
					let box: HTMLInputElement = document.getElementById("filter_All") as HTMLInputElement;
					box.checked = true;
				}
			} else {
				updatedOptions = updatedOptions.filter((option) => option !== value);
				let box: HTMLInputElement = document.getElementById("filter_All") as HTMLInputElement;
				box.checked = false;
			}
		}
		props.setParamsFunction((p: any) => ({ ...p, types: updatedOptions }));
		props.setDummy(Math.random())
	};

	const renderTooltip = (props: JSX.IntrinsicAttributes & TooltipProps & RefAttributes<HTMLDivElement>) => (
		<Tooltip id="button-tooltip" {...props}>
			Click to Filter
		</Tooltip>
	);

	return (
		<Dropdown as={ButtonGroup}>
			{/* do NOT remove Overlay Trigger */}
			<OverlayTrigger placement="right" delay={{ show: 150, hide: 150 }} overlay={renderTooltip}>
				<Dropdown.Toggle split variant="outline-dark" style={{ minWidth: "150px", textAlign: "left", width: "100%" }}>
					{props.title ?? "Option"}
				</Dropdown.Toggle>
			</OverlayTrigger>
			<Dropdown.Toggle split variant="outline-dark" id="dropdown-checkboxes" style={{ width: "100%" }}>
				<FontAwesomeIcon icon={faFilter} className="custom-icon" />
			</Dropdown.Toggle>

			<Dropdown.Menu>
				<Form className='px-3'>
					<Form.Check
						type="checkbox"
						id='filter_All'
						label="All"
						value="All"
						onChange={handleCheckboxChange}
						defaultChecked={true}
					/>
					{/* Select Datas here */}
					{props.data.map((filter, index) => (
						<Form.Check
							key={index}
							id={"filter_" + index}
							type="checkbox"
							label={filter.label}
							value={filter.value}
							onChange={handleCheckboxChange}
							defaultChecked={true}
						/>
					))}
				</Form>
			</Dropdown.Menu>
		</Dropdown>
	);
};

