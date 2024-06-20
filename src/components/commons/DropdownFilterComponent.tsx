import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ChangeEvent, RefAttributes, useEffect, useState } from 'react';
import { Button, ButtonGroup, Dropdown, Form, OverlayTrigger, Tooltip, TooltipProps } from 'react-bootstrap'
import { JSX } from 'react/jsx-runtime';
import { Roles } from '../../utils/Enum';

type Props = {
	title: string | null
	data: { label: string, value: string }[]
	params: string[]
	setParamsFunction: any;
	initFunction: () => void;
}



export const DropdownFilterComponent = (props: Props) => {

	const allValues: string[] = props.data.map(filter => { return filter.value });

	useEffect(() => {
		props.initFunction()
	}, [props.params])

	const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { value, checked } = event.target;
		let updatedOptions: string[] = [...props.params];
		if (value === "All") {
			if (checked) {
				updatedOptions = allValues;
				props.data.forEach((c, index) => {
					let box: HTMLInputElement = document.getElementById("filter_" + index) as HTMLInputElement;
					box.checked = true;
				})
			}
		} else {
			if (checked) {
				updatedOptions.push(value);
			} else {
				updatedOptions = updatedOptions.filter((option) => option !== value);
				if (updatedOptions.length === 0) {
					let box: HTMLInputElement = document.getElementById("filter_All") as HTMLInputElement;
					box.checked = false;
				}
			}
		}
		console.log(updatedOptions);
		props.setParamsFunction(updatedOptions);
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
				<Dropdown.Toggle split variant="outline-dark" style={{ minWidth: "150px", textAlign:"left", width:"100%" }}>
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

