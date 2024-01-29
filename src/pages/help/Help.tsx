const Help = () => {
    return (
        <div>
            <p>If you have major problems, you could reset your storage.</p>
            <p>This will DELETE all your saved  presets! Please create backup file.</p>
            <br></br>
            <button onClick={e => {
                if (confirm('Do you really want to delete all storage records?'))
                    localStorage.clear();
            }}>Clear storage</button>
        </div>

    )
}

export default Help;