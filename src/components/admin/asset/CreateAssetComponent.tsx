import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { ColorPalette } from "../../../utils/ColorPalette";
import * as Yup from "yup";
import { useFormik } from "formik";
import { AssetState } from "../../../utils/Enum";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const assetValidationSchema = Yup.object({
  assetName: Yup.string()
    .max(100, "Asset name must be at most 100 characters")
    .matches(/^[a-zA-Z]+$/, "Asset name cannot contain special characters")
    .required("Asset name is required"),
  categoryName: Yup.string()
    // .max(100, 'Last name must be at most 128 characters')
    .required("Category is required"),
  specification: Yup.string()
    .max(300, "Specification must be at most 300 characters")
    .required("Specification is required"),
  installedDate: Yup.date()
    .max(new Date(), "Installed date must be from the current date or earlier")
    .required("Installed date is required"),
});

export const CreateAssetComponent = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      assetName: "",
      categoryName: "",
      specification: "",
      installedDate: "",
      state: AssetState.AVAILABLE,
    },
    validationSchema: assetValidationSchema,
    onSubmit: async (values) => {
      console.log(values);
      setLoading(false);
    }
    // onChange: (event: any) => {
    //   console.log(event);
    // },
  });
  return (
    <div>
      <Container>
        <Form
          className="p-5"
          style={{ maxWidth: "60%", minWidth: "300px", textAlign: "left" }}
          onSubmit={formik.handleSubmit}
        >
          <h4 style={{ color: ColorPalette.PRIMARY_COLOR }} className="mb-4">
            Create New Asset
          </h4>
          <Form.Group as={Row} className="mb-3" controlId="assetName">
            <Form.Label column sm={3}>
              Name
            </Form.Label>
            <Col sm={9}>
              <Form.Control
                type="text"
                {...formik.getFieldProps("assetName")}
              />
              {formik.touched.assetName && formik.errors.assetName ? (
                <div className="error-message">{formik.errors.assetName}</div>
              ) : null}
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="categoryName">
            <Form.Label column sm={3}>
              Category
            </Form.Label>
            <Col sm={9}>
              <Form.Control
                type="text"
                {...formik.getFieldProps("categoryName")}
              />
              {/* {formik.touched.lastName && formik.errors.lastName ? (
            <div className="error-message">{formik.errors.lastName}</div>
          ) : null} */}
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="specification">
            <Form.Label column sm={3}>
              Specification
            </Form.Label>
            <Col sm={9}>
              <Form.Control
                as="textarea"
                rows={4}
                {...formik.getFieldProps("specification")}
              />
              {formik.touched.specification && formik.errors.specification ? (
                <div className="error-message">
                  {formik.errors.specification}
                </div>
              ) : null}
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="installedDate">
            <Form.Label column sm={3}>
              Installed Date
            </Form.Label>
            <Col sm={9}>
              <Form.Control
                type="date"
                {...formik.getFieldProps("installedDate")}
              />
              {formik.touched.installedDate && formik.errors.installedDate ? (
                <div className="error-message">
                  {formik.errors.installedDate}
                </div>
              ) : null}
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="state">
            <Form.Label column sm={3}>
              State
            </Form.Label>
            <Col sm={9} id="state" className="red-border-on-focus">
              <Form.Check
                label={AssetState.AVAILABLE}
                name="state"
                value={AssetState.AVAILABLE}
                type="radio"
                id={AssetState.AVAILABLE}
                className="me-5"
                defaultChecked={true}
                onChange={formik.handleChange}
              />
              <Form.Check
                label={AssetState.NOT_AVAILABLE}
                name="state"
                value={AssetState.NOT_AVAILABLE}
                type="radio"
                id={AssetState.NOT_AVAILABLE}
                onChange={formik.handleChange}
              />
            </Col>
          </Form.Group>
          <Row>
            <Col className="d-flex justify-content-end my-4">
              <Button
                variant="danger"
                className="mx-4"
                style={{ minWidth: "100px" }}
                type="submit"
                disabled={!formik.dirty || !formik.isValid}
              >
                {" "}
                {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Save"}
              </Button>
              <Button
                variant="outline-dark"
                className="ms-4"
                style={{ minWidth: "100px" }}
                onClick={() => {
                  navigate(-1);
                }}
              >
                Cancel
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </div>
  );
};
