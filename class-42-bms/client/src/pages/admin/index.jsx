import { Tabs } from "antd";
import MovieList from "./MovieList";
import TheatreTable from "./TheatreTable";

const Admin = () => {
    const tabItems = [
        {
            key: "1",
            label: "Movies",
            children: <MovieList />
        },
        {
            key: "2",
            label: "Theatres",
            children: <TheatreTable />
        }
    ];
    return (
        <div>
            <header className="App-header_base">
                <h1>Admin Page</h1>
                <Tabs items={tabItems} />
            </header>
        </div>
    )
};

export default Admin;