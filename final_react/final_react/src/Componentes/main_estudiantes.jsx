import React, { useState, useRef, useMemo } from "react";
import "./../assets/css/main.css";

import {
  EditOutlined,
  DeleteOutlined,
  FilePdfOutlined,
  PlusCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Button, Modal, Space, notification } from "antd";

import axios from "axios";

const Context = React.createContext({
  name: "Default",
});
const endpoint = "http://localhost:3000";

const Main_estudiantes = () => {
  const [matricula, setMatricula] = useState("");
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [idCarrera, setIdCarrera] = useState("");
  const [nombreCarrera, setNombreCarrera] = useState("");
  const [alumnos, setAlumnos] = useState([]);
  const [carreras, setCarreras] = useState([]);
  // const [modal] = Modal.useModal();
  const [modal, contextHolder] = Modal.useModal();

  const [isModalCarreraOpen, setIsModalCarreraOpen] = useState(false);
  const [isModalStudentOpen, setIsModalStudentOpen] = useState(false);
  const [userSelected, setUserSelected] = useState(0);
  const nombreCarreraRef = useRef(0);

  const handleSelectChange = (e) => {
    const selectedId = parseInt(e.target.value);
    setIdCarrera(selectedId);
  };

  const vaciarValor = () => {
    nombreCarreraRef.current.value = "";
  };

  const showModalEstudiante = (matricula) => {
    setIsModalStudentOpen(true);
    setUserSelected(matricula);
  };

  const showModalCarrera = () => {
    setIsModalCarreraOpen(true);
  };
  const handleOkModalCarrera = () => {
    setIsModalCarreraOpen(false);
    AgregarCarrera();
    vaciarValor();
  };
  const handleOkModalEstudiante = () => {
    ActualizarAlumnos(userSelected);
    setIsModalStudentOpen(false);
  };
  const handleCancelModalEstudiante = () => {
    setIsModalStudentOpen(false);
  };
  const handleCancelModalCarrera = () => {
    setIsModalCarreraOpen(false);
  };

  const confirm = (matricula, nombre) => {
    modal.confirm({
      title: "Confirmar acción",
      icon: <ExclamationCircleOutlined />,
      okText: "Si, eliminar",
      content: `Desea eliminar al estudiante ${nombre} con matricula ${matricula}`,
      onOk() {
        EliminarEstudiante(matricula, nombre);
      },
      cancelText: "Cancelar",
    });
  };

  const ObtenerCarreras = () => {
    axios.get(endpoint + "/careers").then((resp) => {
      setCarreras(resp.data);
    });
  };

  const generarPDFAlumnos = () => {
    axios
      .get(endpoint + "/students/generate-pdf", { responseType: "blob" })
      .then((response) => {
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "student_list.pdf");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Error al descargar el PDF:", error);
      });
  };

  const AgregarCarrera = () => {
    axios
      .post(endpoint + "/careers", {
        nombre: nombreCarrera,
      })
      .then((response) => {
        ObtenerCarreras();
      });
  };
  const ActualizarAlumnos = (matricula) => {
    axios
      .patch(endpoint + `/students/${matricula}`, {
        matricula: matricula,
        nombre: nombre,
        direccion: direccion,
        career: {
          id: idCarrera,
        },
      })
      .then((response) => {
        openUpdateNotification("topRight", nombre);
        ObtenerDatos();
      })
      .catch((error) => {
        openErrorNotification("topLeft", nombre, error);
      });
  };
  const AgregarAlumnos = () => {
    event.preventDefault();

    axios
      .post(endpoint + "/students", {
        matricula: matricula,
        nombre: nombre,
        direccion: direccion,
        career: {
          id: idCarrera,
        },
      })
      .then((response) => {
        openNotification("topRight", nombre);
        ObtenerDatos();

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch((error) => {
        openErrorNotification("topLeft", nombre, error);
      });
  };

  const EliminarEstudiante = (matricula, nombre) => {
    axios
      .delete(endpoint + `/students/${matricula}`)
      .then((resp) => {
        openDeleteSuccessNotification("top", nombre);
        setTimeout(() => {
          window.location.reload();
        }, 200);
      })
      .catch((error) => {
        console.error("Error al eliminar el estudiante:", error);
        alert(
          "Se produjo un error al intentar eliminar el estudiante. Por favor, inténtalo de nuevo más tarde."
        );
      });
  };

  const ObtenerDatos = () => {
    axios.get(endpoint + "/students").then((resp) => {
      setAlumnos(resp.data);
    });
  };

  ObtenerDatos();
  ObtenerCarreras();

  const openUpdateNotification = (placement, nombreEstudiante) => {
    notification.info({
      message: `Estudiante ${nombreEstudiante} ha sido actualizado exitosamente`,
      duration: 70000,
      placement,
    });
  };

  const openNotification = (placement, nombreEstudiante) => {
    notification.info({
      message: `Estudiante ${nombreEstudiante} ha sido agregado con exito`,
      duration: 10000,
      description: (
        <Context.Consumer>
          {({ name }) =>
            `Podras editar a ${nombreEstudiante} en cualquier momento`
          }
        </Context.Consumer>
      ),
      placement,
    });
  };

  const openDeleteSuccessNotification = (placement, nombreEstudiante) => {
    notification.info({
      message: `Estudiante ${nombreEstudiante} ha sido eliminado con exito`,
      duration: 50000,
      placement,
    });
  };

  const openErrorNotification = (placement, nombreEstudiante, msg) => {
    notification.info({
      message: `Error al agregar al estudiante ${nombreEstudiante}, verifique que los datos sean correctos, error: ${msg}`,
      duration: 50000,
      placement,
    });
  };

  const contextValue = useMemo(
    () => ({
      name: "Ant Design",
    }),
    []
  );

  return (
    <Context.Provider value={contextValue}>
      <div className="container altaEstudiantes">
        <div className="register-container">
          <div className="card mt-5">
            <div className="row m-3">
              <div className="col-3 imagen-reg">
                <img src="./../src/assets/imagenes/checklist.jpeg" alt="" />
              </div>
              <div className="card-body col-9">
                <form
                  onSubmit={AgregarAlumnos}
                  action="
                "
                >
                  <div className="container-control">
                    <input
                      required
                      className="form-control form-control-lg"
                      onChange={(e) => {
                        setMatricula(e.target.value);
                      }}
                      type="number"
                      placeholder="Matricula del estudiante"
                      aria-label=".form-control-lg"
                    />
                  </div>
                  <div className="container-control">
                    <input
                      required
                      className="form-control form-control-lg"
                      onChange={(e) => {
                        setNombre(e.target.value);
                      }}
                      type="text"
                      placeholder="Nombre del estudiante"
                      aria-label=".form-control-lg example"
                    />
                  </div>
                  <div className="container-control">
                    <input
                      required
                      className="form-control form-control-lg"
                      type="text"
                      onChange={(e) => {
                        setDireccion(e.target.value);
                      }}
                      placeholder="Domicilio del estudiante"
                      aria-label=".form-control-lg example"
                    />
                  </div>
                  <div className="container-control">
                    <div className="row">
                      <div className="col-11">
                        <select
                          required
                          className="form-select form-select-lg"
                          value={idCarrera}
                          onChange={handleSelectChange}
                          aria-label=".form-select-lg example"
                        >
                          <option value="">Seleccione una carrera</option>
                          {carreras.map((carrera, index) => (
                            <option key={index} value={carrera.id}>
                              {carrera.nombre}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-1">
                        <Button
                          icon={<PlusCircleOutlined />}
                          type="text"
                          onClick={showModalCarrera}
                        ></Button>
                      </div>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-danger text-white form-control mt-3"
                  >
                    Guardar registro
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="container-data">
          <Button
            icon={<FilePdfOutlined />}
            type="text"
            onClick={generarPDFAlumnos}
          >
            Generar PDF
          </Button>
          <hr />
          <table className="table table-bordered table-hover">
            <thead>
              <tr>
                <th scope="col">Matricula</th>
                <th scope="col">Nombre</th>
                <th scope="col">Dirección</th>
                <th scope="col">Carrera</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {alumnos.map((alumno, key) => {
                return (
                  <tr key={alumno.matricula}>
                    <th scope="row">{alumno.matricula}</th>
                    <td>{alumno.nombre}</td>
                    <td>{alumno.direccion}</td>
                    <td>{alumno.career.nombre}</td>
                    <td>
                      <Button
                        type="text"
                        shape="circle"
                        // onClick={showModalEstudiante(alumno.matricula)}
                        onClick={() => showModalEstudiante(alumno.matricula)} // Cambio aquí
                        icon={<EditOutlined />}
                      />

                      <Space>
                        <Button
                          type="text"
                          shape="circle"
                          onClick={() =>
                            confirm(alumno.matricula, alumno.nombre)
                          }
                          icon={<DeleteOutlined />}
                        />
                        {contextHolder}
                      </Space>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <>
          <Modal
            title="Agregar una carrera"
            open={isModalCarreraOpen}
            onOk={handleOkModalCarrera}
            okText={"Guardar Carrera"}
            onCancel={handleCancelModalCarrera}
          >
            <div className="container-control">
              <input
                className="form-control form-control-lg"
                onChange={(e) => {
                  setNombreCarrera(e.target.value);
                }}
                ref={nombreCarreraRef}
                id="nombre-carrera"
                type="text"
                placeholder="Nombre de la carrera"
                aria-label=".form-control-lg"
              />
            </div>
          </Modal>

          <Modal
            title="Actualizar Estudiante"
            open={isModalStudentOpen}
            onOk={() => {
              handleOkModalEstudiante();
            }}
            okText={"Actualizar estudiante"}
            onCancel={handleCancelModalEstudiante}
          >
            <>
              <div className="card-body col-9">
                <div className="container-control">
                  <input
                    className="form-control form-control-lg"
                    onChange={(e) => {
                      setMatricula(e.target.value);
                    }}
                    type="number"
                    placeholder="Matricula del estudiante"
                    aria-label=".form-control-lg"
                  />
                </div>
                <div className="container-control">
                  <input
                    className="form-control form-control-lg"
                    onChange={(e) => {
                      setNombre(e.target.value);
                    }}
                    type="text"
                    placeholder="Nombre del estudiante"
                    aria-label=".form-control-lg example"
                  />
                </div>
                <div className="container-control">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    onChange={(e) => {
                      setDireccion(e.target.value);
                    }}
                    placeholder="Domicilio del estudiante"
                    aria-label=".form-control-lg example"
                  />
                </div>
                <div className="container-control">
                  <div className="row">
                    <div className="col-11">
                      <select
                        className="form-select form-select-lg"
                        value={idCarrera}
                        onChange={handleSelectChange}
                        aria-label=".form-select-lg example"
                      >
                        <option value="">Seleccione una carrera</option>
                        {carreras.map((carrera, index) => (
                          <option key={index} value={carrera.id}>
                            {carrera.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-1">
                      <Button
                        icon={<PlusCircleOutlined />}
                        type="text"
                        onClick={showModalCarrera}
                      ></Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          </Modal>
        </>
      </div>
    </Context.Provider>
  );
};

export default Main_estudiantes;
