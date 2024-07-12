import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createRoot }                          from "react-dom/client";
import { GeneralProvider }                     from "../ux/contexts/general.context";
import { WSProvider }                          from "../ux/contexts/ws.context";
import                                              "../ui/styles/index.css";
import App                from "../ui/pages/app";
import Error              from "../ui/pages/error";
import Notfound           from "../ui/pages/notfound";
import SideSectionChat    from "../ui/layouts/sideSectionChat";
import SideSectionMembers from "../ui/layouts/sideSectionMembers";
import SideSectionSetting from "../ui/layouts/sideSectionSetting";
import SideSectionHome    from "../ui/layouts/sideSectionHome";
// import SideSectionDevlog  from "../ui/layouts/sideSectionDevlog";

if (localStorage.theme) document.documentElement.classList.add(localStorage.theme);

const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <GeneralProvider>
                <WSProvider>
                    <App />
                </WSProvider>
            </GeneralProvider>
        ),
        errorElement: <Error />,
        children: [
            {
                index: true,
                element: <SideSectionHome />,
            },
            // {
            //     path: '/devlog',
            //     element: <SideSectionDevlog />,
            // },
            {
                path: '/chat',
                element: <SideSectionChat />,
            },
            {
                path: '/member',
                element: <SideSectionMembers />,
            },
            {
                path: '/setting',
                element: <SideSectionSetting />,
            },
        ],
    },
    {
        path: '*',
        element: <Notfound />
    }
]);

createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
);
