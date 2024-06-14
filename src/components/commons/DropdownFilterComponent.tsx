import { faFilter, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ChangeEvent, useState } from 'react';
import { Button, ButtonGroup, Dropdown, DropdownButton, Form } from 'react-bootstrap'

type Props = {
	title: string | null
}



export const DropdownFilterComponent = ({ title }: Props) => {
	const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

	const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { value, checked } = event.target;
		let updatedOptions: string[] = [...selectedOptions];

		if (checked) {
			updatedOptions.push(value);
		} else {
			updatedOptions = updatedOptions.filter((option) => option !== value);
		}
		setSelectedOptions(updatedOptions);
	};

	return (
		<Dropdown as={ButtonGroup}>
			<Dropdown.Toggle split variant="outline-dark" id="dropdown-checkboxes" style={{minWidth:"100px"}}>
				{title ?? "Option"}
			</Dropdown.Toggle>

			<Dropdown.Menu>
				<Form className='px-3'>
					{/* Select Datas here */}
					<Form.Check
						type="checkbox"
						label="Option 1"
						value="Option 1"
						onChange={handleCheckboxChange}
					/>
					<Form.Check
						type="checkbox"
						label="Option 2"
						value="Option 2"
						onChange={handleCheckboxChange}
					/>
					<Form.Check
						type="checkbox"
						label="Option 3"
						value="Option 3"
						onChange={handleCheckboxChange}
					/>
				</Form>
			</Dropdown.Menu>

			<Button variant="outline-dark" style={{ width: "100%" }}>
				<FontAwesomeIcon icon={faFilter} className="custom-icon" />
			</Button>

		</Dropdown>
	);
};

