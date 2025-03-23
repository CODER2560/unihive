import { RotatingLines } from "react-loader-spinner";
import '../Loader/loader.scss';

function Loader() {
  return (
    // <RotatingLines
    //   strokeColor="grey"
    //   strokeWidth="5"
    //   animationDuration="0.75"
    //   width="96"
    //   visible={true}
    // />
    <>
    <div class="spinner">
    <div class="spinnerin"></div>
</div>
    </>
  )
}
export default Loader