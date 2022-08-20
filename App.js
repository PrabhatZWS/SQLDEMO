import React, { useEffect, useState } from "react";
import { View, Text, StatusBar, TextInput, Button, FlatList, SafeAreaView, TouchableOpacity, Alert } from "react-native";
import { openDatabase } from "react-native-sqlite-storage";
const db = openDatabase({
  name: "PrabhatDemoSQLLITE",
});

const App = () => {
  const [Todo, setTodo] = useState("");
  const [TodoItem, setTodoItem] = useState([]);

  const createTables = () => {
    db.transaction(txn => {
      txn.executeSql(
        `CREATE TABLE IF NOT EXISTS TodoItem (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(20))`,
        [],
        (sqlTxn, res) => {
          Alert.alert("table created successfully");
        },
        error => {
          console.log("error on creating table " + error.message);
        },
      );
    });
  };

  const addTodo = () => {
    if (!Todo) {
      alert("Enter Todo");
      return false;
    }

    db.transaction(txn => {
      txn.executeSql(
        `INSERT INTO TodoItem (name) VALUES (?)`,
        [Todo],
        (sqlTxn, res) => {
          console.log(`${Todo} Todo added successfully`);
          getTodoItem();
          setTodo("");
        },
        error => {
          console.log("error on adding Todo " + error.message);
        },
      );
    });
  };


const  ExecuteQuery = (sql, params = []) => new Promise((resolve, reject) => {
  db.transaction((trans) => {
    trans.executeSql(sql, params, (trans, results) => {
      resolve(results);
    },
      (error) => {
        reject(error);
      });
  });
});





  const getTodoItem = () => {
    db.transaction(txn => {
      txn.executeSql(
        `SELECT * FROM TodoItem ORDER BY id DESC`,
        [],
        (sqlTxn, res) => {
          console.log("TodoItem retrieved successfully");
          let len = res.rows.length;
          if (len >= 0) {
            let results = [];
            for (let i = 0; i < len; i++) {
              let item = res.rows.item(i);
              results.push({ id: item.id, name: item.name });
            }
            setTodoItem(results);
          }
        },
        error => {
          console.log("error on getting TodoItem " + error.message);
        },
      );
    });
  };

const delData=async(id)=>{
    await ExecuteQuery('DELETE FROM TodoItem WHERE ID=?', [id]);
    getTodoItem()
}

  const renderTodo = ( item ) => {
    return (
      <View style={{
        flexDirection: "row",
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderColor: "#ddd",
        alignItems:'center'
      }}>
        <Text style={{ marginRight: 9 }}>{item.index+1}</Text>
        <Text>{item.item.name}</Text>
       <View style={{flex:1,justifyContent:'flex-end',alignItems:'flex-end'}}>
        <TouchableOpacity onPress={()=>delData(item.item.id)} style={{alignItems:'center'}}>
        <Text style={{color:'white',fontSize:20,backgroundColor:"red",padding:2}}>Delete</Text>
     </TouchableOpacity>
       </View>
      </View>
    );
  };



  useEffect(() => {
    async function fetchData() {
      await createTables();
      await getTodoItem();
    }
    fetchData();
  }, []);
  return (
    <SafeAreaView style={{flex:1,justifyContent:'center',padding:50}}>
      <StatusBar backgroundColor="#222" />

      <TextInput
        placeholder="Enter Todo"
        value={Todo}
        onChangeText={setTodo}
        style={{ margin:20 ,borderWidth:0.5,height:40,borderRadius:5}}
      />
     <TouchableOpacity onPress={addTodo} style={{alignItems:'center'}}>
        <Text style={{color:'white',fontSize:20,backgroundColor:"blue",padding:10}}>Submit</Text>
     </TouchableOpacity>

      

      <FlatList
        data={TodoItem}
        renderItem={(item)=> renderTodo(item)}
        key={cat => cat.id}
      />
    </SafeAreaView>
  );
};

export default App;