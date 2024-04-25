import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import Encabezado from "./Componentes/encabezado";
import Main_estudiantes from "./Componentes/main_estudiantes";
function App() {
  return (
    <>
      <Encabezado />
      <Main_estudiantes />
    </>
  );
}
export default App;
