const { createClient } = require("@supabase/supabase-js");
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);
    const fetchData = async () => {
      try {
        const { data, error } = await supabase.from("your_table_name").select("*");
        if (error) throw error;
        console.log("Data:", data);
      } catch (err) {
        console.error("Error fetching data:", err.message);
      }
    };
    fetchData();
    