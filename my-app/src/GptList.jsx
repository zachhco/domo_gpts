import { gptSlugToNameMap } from "./gptSlugToNameMap";

export function GptList({ onSelectGpt }) {
    return <div className="gpt-list-container">
        {Object.keys(gptSlugToNameMap).map((gptSlug) => (
            <button onClick={() => onSelectGpt(gptSlug)} key={gptSlug}>{gptSlugToNameMap[gptSlug]}</button>
        ))}
    </div>
}
