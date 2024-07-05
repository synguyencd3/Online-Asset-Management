import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { ColorPalette } from "../../../utils/ColorPalette";
import * as Yup from "yup";
import { useFormik } from "formik";
import { AssetState } from "../../../utils/Enum";
import { ReactNode, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import { message } from "antd";
import {
  AssetDetailModel,
  AssetEditRequestModel,
  AssetForTableModel,
} from "../../../models/AssetModel";
import {
  getOneAssetUrl,
  updateAsset,
} from "../../../services/AssetService";
import useSWR from "swr";
import { getWithSWR } from "../../../services/swrService";
import { BreadcrumbComponent } from "../../commons/BreadcrumbComponent";

const assetValidationSchema = Yup.object({
  assetName: Yup.string()
    .max(100, "Asset name must be at most 100 characters")
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

function formatAssetState(state: string) {
  state = state
    .toLowerCase()
    .replace(/_/g, " ");
  state = state.charAt(0).toUpperCase() + state.slice(1);
  return state;
}

type Props = {
  setHeaderTitle: (title: ReactNode) => void
}

export const EditAssetComponent = (props: Props) => {
  const location = useLocation();
  const assetProps: AssetForTableModel = location.state.assetProps;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    props.setHeaderTitle(<BreadcrumbComponent breadcrumb={[
      {
        title: 'Manage Asset',
        href: `${window.location.origin}/admin/manage-assets#`
      },
      {
        title: "Edit Asset",
        href: `${window.location.origin}/admin/manage-assets/edit#`
      }
    ]} />);
  }, [])

  const formik = useFormik({
    initialValues: {
      assetName: "",
      categoryName: "",
      specification: "",
      installedDate: "",
      assetState: AssetState.AVAILABLE,
    },
    validationSchema: assetValidationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const data: AssetEditRequestModel = {
        assetName: values.assetName,
        specification: values.specification,
        installDate: values.installedDate,
        assetState: values.assetState.toUpperCase().replace(/ /g, "_"),
      };
      await updateAsset(assetProps.assetCode, data)
        .then((response) => {
          message.success(response.data.message);
          const newAsset: AssetForTableModel = response.data.data;
          setLoading(false);
          navigate("/admin/manage-assets", {
            replace: true,
            state: { newAsset: newAsset },
          });
        })
        .catch((error) => {
          message.error(error.response.data.message);
          setLoading(false);
        });
    },
  });

  useSWR(
    assetProps ? getOneAssetUrl(assetProps.assetCode) : null,
    getWithSWR,
    {
      onSuccess: (response) => {
        const thisAsset: AssetDetailModel = response.data.data;
        formik.setFieldValue("assetName", thisAsset.name);
        formik.setFieldValue("categoryName", thisAsset.category);
        formik.setFieldValue("specification", thisAsset.specification);
        formik.setFieldValue("installedDate", thisAsset.installedDate);
        formik.setFieldValue("assetState", formatAssetState(thisAsset.state));
      },
    }
  );

  return (
    <div>
      <Container>
        <Form
          className="p-5"
          style={{ maxWidth: "60%", minWidth: "300px", textAlign: "left" }}
          onSubmit={formik.handleSubmit}
        >
          <h4 style={{ color: ColorPalette.PRIMARY_COLOR }} className="mb-4">
            Edit New Asset
          </h4>
          <Form.Group as={Row} className="mb-3" controlId="assetName">
            <Form.Label column sm={3}>
              Name
              <span className='mx-1' style={{ color: ColorPalette.PRIMARY_COLOR }}>*</span>
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
              <span className='mx-1' style={{ color: ColorPalette.PRIMARY_COLOR }}>*</span>
            </Form.Label>
            <Col sm={9}>
              <Form.Select disabled defaultValue={formik.values.categoryName}>
                <option value={formik.values.categoryName}>
                  {formik.values.categoryName}
                </option>
              </Form.Select>
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="specification">
            <Form.Label column sm={3}>
              Specification
              <span className='mx-1' style={{ color: ColorPalette.PRIMARY_COLOR }}>*</span>
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
              <span className='mx-1' style={{ color: ColorPalette.PRIMARY_COLOR }}>*</span>
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
          <Form.Group as={Row} className="mb-3" controlId="assetState">
            <Form.Label column sm={3}>
              State
              <span className='mx-1' style={{ color: ColorPalette.PRIMARY_COLOR }}>*</span>
            </Form.Label>
            <Col sm={9} id="assetState" className="red-border-on-focus">
              <Form.Check
                label={AssetState.AVAILABLE}
                name="assetState"
                value={AssetState.AVAILABLE}
                type="radio"
                id={AssetState.AVAILABLE}
                className="me-5"
                onChange={formik.handleChange}
                checked={formik.values.assetState === AssetState.AVAILABLE}
              />
              <Form.Check
                label={AssetState.NOT_AVAILABLE}
                name="assetState"
                value={AssetState.NOT_AVAILABLE}
                type="radio"
                id={AssetState.NOT_AVAILABLE}
                onChange={formik.handleChange}
                checked={formik.values.assetState === AssetState.NOT_AVAILABLE}
              />
              <Form.Check
                label={AssetState.WAITING_FOR_RECYCLING}
                name="assetState"
                value={AssetState.WAITING_FOR_RECYCLING}
                type="radio"
                id={AssetState.WAITING_FOR_RECYCLING}
                onChange={formik.handleChange}
                checked={
                  formik.values.assetState === AssetState.WAITING_FOR_RECYCLING
                }
              />
              <Form.Check
                label={AssetState.RECYCLED}
                name="assetState"
                value={AssetState.RECYCLED}
                type="radio"
                id={AssetState.RECYCLED}
                onChange={formik.handleChange}
                checked={formik.values.assetState === AssetState.RECYCLED}
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
                disabled={!formik.dirty || !formik.isValid || loading}
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
