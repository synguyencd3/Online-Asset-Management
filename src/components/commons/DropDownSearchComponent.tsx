import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RefAttributes, useState } from "react";
import { Button, Form, InputGroup, OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";
import { JSX } from "react/jsx-runtime";

type Props = {
    placeholder: string | null
    setParamsFunction: any;
    setDummy: any;
    style: Object
}


export const DropdownSearchComponent = (props: Props) => {
    const [search, setSearch] = useState<string>("");


    const renderTooltip = (props: JSX.IntrinsicAttributes & TooltipProps & RefAttributes<HTMLDivElement>) => {
        return (
            <Tooltip id="button-tooltip" {...props}>
                Click to Search
            </Tooltip>
        );
    };

    return (
            <InputGroup id="search-group" className="" style={{ maxWidth: "" }}>
                <Form.Control placeholder={props.placeholder ?? ""} id="search-input" name="search" onChange={(e) => setSearch(e.target.value)} />
                <OverlayTrigger placement="right" delay={{ show: 150, hide: 150 }} overlay={renderTooltip}>
                    <Button type="button" variant="outline-dark" id="search-button" onClick={() => { props.setParamsFunction((p: object) => ({ ...p, search: search })); props.setDummy(Math.random());}}>
                        <FontAwesomeIcon size='lg' icon={faMagnifyingGlass} />
                    </Button>
                </OverlayTrigger>
            </InputGroup>
    );
}
