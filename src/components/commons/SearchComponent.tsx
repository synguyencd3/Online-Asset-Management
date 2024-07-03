import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormEvent, RefAttributes } from "react";
import { Button, Form, InputGroup, OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";
import { JSX } from "react/jsx-runtime";

type Props = {
    placeholder: string | null
    params: string
    setParamsFunction: any;
    setDummy: any;
    style: Object
}


export const SearchComponent = (props: Props) => {

    function SubmitSearch(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        props.setDummy(Math.random());
    }

    const renderTooltip = (props: JSX.IntrinsicAttributes & TooltipProps & RefAttributes<HTMLDivElement>) => {
        return (
            <Tooltip id="button-tooltip" {...props}>
                Click to Search
            </Tooltip>
        );
    };

    return (
        <Form onSubmit={(e) => { SubmitSearch(e) }} style={{  width: "60%", ...props.style, }}>
            <InputGroup id="search-group" className="" style={{ maxWidth: "" }}>
                <Form.Control placeholder={props.placeholder ?? ""} id="search-input" name="search" onChange={(e) => { props.setParamsFunction((p: any) => ({ ...p, search: e.target.value })) }} />
                <OverlayTrigger placement="right" delay={{ show: 150, hide: 150 }} overlay={renderTooltip}>
                    <Button type="submit" variant="outline-dark" id="search-button">
                        <FontAwesomeIcon size='lg' icon={faMagnifyingGlass} />
                    </Button>
                </OverlayTrigger>
            </InputGroup>
        </Form>
    );
}
