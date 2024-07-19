export default function Advert({
  id,
  alertFunction
}) {
  return (
    <div className="existing-contract">
      <ul className="fields">
        <li onClick={() => alertFunction(id)}>
          <div> Advert </div>
          <div> #{id} </div>
        </li>
      </ul>
    </div>
  );
}
