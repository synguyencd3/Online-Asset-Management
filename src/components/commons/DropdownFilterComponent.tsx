import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ChangeEvent, RefAttributes, useState } from 'react';
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

	const [allIsChecked, setAllIsChecked] = useState(false);

	const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {

		const { value, checked } = event.target;
		let updatedOptions: string[] = [...props.params];
		if (value === "All") {
			if (checked) {
				updatedOptions = allValues;
			} else {
				updatedOptions = [];
			}
			props.data.forEach((c, index) => {
				let box: HTMLInputElement = document.getElementById("filter_" + index) as HTMLInputElement;
				box.checked = false;
			})
			setAllIsChecked(checked);
		} else {
			if (!allIsChecked) {
				if (checked) {
					updatedOptions.push(value);
				} else {
					updatedOptions = updatedOptions.filter((option) => option !== value);
				}
			}
		}
		props.setParamsFunction(updatedOptions);
	};

	function submitFilter() {


	}

	const renderTooltip = (props: JSX.IntrinsicAttributes & TooltipProps & RefAttributes<HTMLDivElement>) => (
		<Tooltip id="button-tooltip" {...props}>
			Click to Filter
		</Tooltip>
	);

	return (
		<Dropdown as={ButtonGroup}>
			<Dropdown.Toggle split variant="outline-dark" id="dropdown-checkboxes" style={{ minWidth: "100px" }}>
				{props.title ?? "Option"}
			</Dropdown.Toggle>

			<Dropdown.Menu>
				<Form className='px-3'>
					<Form.Check
						type="checkbox"
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
							disabled={allIsChecked}
							defaultChecked={true}
						/>
					))}
				</Form>
			</Dropdown.Menu>
			<OverlayTrigger placement="right" delay={{ show: 150, hide: 150 }} overlay={renderTooltip}>
				<Button variant="outline-dark" style={{ width: "100%" }} onClick={() => { props.initFunction() }}>
					<FontAwesomeIcon icon={faFilter} className="custom-icon" />
				</Button>
			</OverlayTrigger>

		</Dropdown>
	);
};

