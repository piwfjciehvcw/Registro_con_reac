import React from "react";
import "./../assets/css/encabezado.css";
import "animate.css";

const Encabezado = () => {
  return (
    <div className="Header-banner">
      <div className="Header-background col-xl-12 col-md-12">
        <h1 className="animate__animated animate__bounceIn">
          CRUD estudiantes
        </h1>
      </div>
    </div>
  );
};

export default Encabezado;
