import Statistic from "./Statistic";
import ErrorBoundary from "../ErrorBoundary";

export default function HOCError () {
    return <ErrorBoundary>
        <Statistic/>
    </ErrorBoundary>
}