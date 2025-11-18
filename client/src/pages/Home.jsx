// client/src/pages/Home.jsx
import { useUser } from "../UserContext";

export default function Home() {
  const { points, purchasedStickers } = useUser();

  return (
    <div>
      <h1>Home</h1>
      <p>Current points: {points}</p>

      <h2>Purchased Stickers</h2>
      {purchasedStickers.length === 0 ? (
        <p>You haven't purchased any stickers yet.</p>
      ) : (
        <ul>
          {purchasedStickers.map((s) => (
            <li key={s.id}>
              {s.image_url && (
                <img src={s.image_url} alt={s.name} width="48" height="48" />
              )}
              <span>
                {s.name} — ${s.price}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
