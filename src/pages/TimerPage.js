import { useState } from "react";
import { interval } from "rxjs";
import { map } from "rxjs/operators";
import Timer from "../components/Timer/Timer";

const TimerPage = () => {
    const delay = 1000;
    const [timer, setTimer] = useState(0);
    const [diff, setDiff] = useState(0);
    const [subscription, setSubscription] = useState("");
    const [prevent, setPrevent] = useState(true);

    const onStartHandler = () => {
        if (!subscription) {
            const timerSubscription = interval(delay)
                .pipe(map(timeValue => timeValue + 1))
                .subscribe(timeValue => {
                    setTimer(timeValue + diff);
                });

            setSubscription(timerSubscription);
        } else {
            subscription.unsubscribe();
            setTimer(0);
            setDiff(0);
            setSubscription("");
        }
    };

    const onWaitHandler = e => {
        if (prevent) {
            setPrevent(false);
            const timerInstance = setTimeout(() => {
                setPrevent(true);
                clearTimeout(timerInstance);
            }, 300);
        } else {
            if (subscription) {
                subscription.unsubscribe();
            }
            setDiff(timer);
            setSubscription("");
        }
    };

    const onResetHandler = () => {
        if (subscription) {
            subscription.unsubscribe();
        }
        const timerSubscription = interval(delay).
            subscribe(timeValue => {
                setTimer(timeValue);
            });
        setSubscription(timerSubscription);
    };

    return (<>
        <h1>Timer</h1>
        <button onClick={onStartHandler} >
            Start/Stop
        </button>
        <button onClick={onWaitHandler}>
            Wait
        </button>
        <button onClick={onResetHandler}>
            Reset
        </button>
        <Timer timePassed={timer ? timer : diff} />
    </>
    )
}

export default TimerPage;