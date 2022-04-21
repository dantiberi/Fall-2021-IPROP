import RightTriangle from "components/diagrams/RightTriangle";
import QuestionModel from "models/QuestionModel";
import { isRightTriangleTrigModel } from "models/questions/RightTriangleTrigModel";
import Latex from "react-latex";

export const determineQuestionStatement = (question: QuestionModel) => {
    if (question.is_json) {
        const parsed = JSON.parse(question.question);
        const subjectName = question.subject_name;
        if (isRightTriangleTrigModel(parsed)) {
            if (subjectName === "Trig Functions") {
                const latexFunc = (parsed.function === "sine")    ? "sin"
                                : (parsed.function === "cosine")  ? "cos"
                                                                  : "tan";
                const latexString = `$\\${latexFunc}{${parsed.angle}}$`;
                return (
                    <>Solve: <Latex>{latexString}</Latex> as a reduced fraction</>
                );
            } else if (subjectName === "Inverse Trig Functions") {
                const latexString = `$m \\angle ${parsed.angle}$`;
                return (
                    <>Solve: <Latex>{latexString}</Latex> rounded to the nearest hundredth of a degree</>
                );
            }
        }
    }

    return (
        <>Solve: <Latex>{question.question}</Latex></>
    );
}

export const determineQuestionDiagram = (question: QuestionModel) => {
    if (question.is_json) {
        const parsed = JSON.parse(question.question);
        const subjectName = question.subject_name;
        if (isRightTriangleTrigModel(parsed)) {
            let hideA, hideB, hideC;
            hideA = hideB = hideC = false;

            if (subjectName === "Inverse Trig Functions") {
                hideA = parsed.function !== "arctangent"
                     && (  parsed.function !== "arcsine" || parsed.angle !== "A")
                     && (parsed.function !== "arccosine" || parsed.angle !== "B");

                hideB = parsed.function !== "arctangent"
                     && (  parsed.function !== "arcsine" || parsed.angle !== "B")
                     && (parsed.function !== "arccosine" || parsed.angle !== "A");

                hideC = parsed.function === "arctangent";
            }

            return (
                <RightTriangle
                    a={parsed.a}
                    b={parsed.b}
                    c={parsed.c}
                    angle={parsed.angle}
                    hideA={hideA}
                    hideB={hideB}
                    hideC={hideC}
                />
            );
        }
    }

    return undefined;
};
