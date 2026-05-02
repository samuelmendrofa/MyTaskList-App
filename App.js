import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  LayoutAnimation,
  UIManager,
} from 'react-native';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [editId, setEditId] = useState(null);

  const theme = darkMode
    ? {
        bg: '#0f172a',
        card: '#1e293b',
        input: '#334155',
        text: '#ffffff',
        sub: '#cbd5e1',
        primary: '#38bdf8',
      }
    : {
        bg: '#f8fafc',
        card: '#ffffff',
        input: '#e2e8f0',
        text: '#0f172a',
        sub: '#475569',
        primary: '#0ea5e9',
      };

  const animate = () => {
    LayoutAnimation.configureNext(
      LayoutAnimation.Presets.easeInEaseOut
    );
  };

  const addTask = () => {
    if (task.trim() === '') {
      Alert.alert('Error', 'Task cannot be empty!');
      return;
    }

    animate();

    if (editId) {
      setTasks(
        tasks.map((item) =>
          item.id === editId
            ? { ...item, title: task }
            : item
        )
      );
      setEditId(null);
    } else {
      const newTask = {
        id: Date.now().toString(),
        title: task,
        done: false,
        createdAt: new Date().toLocaleString(),
      };

      setTasks([newTask, ...tasks]);
    }

    setTask('');
  };

  const editTask = (item) => {
    setTask(item.title);
    setEditId(item.id);
  };

  const deleteTask = (id) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            animate();
            setTasks(
              tasks.filter((item) => item.id !== id)
            );
          },
        },
      ]
    );
  };

  const toggleDone = (id) => {
    animate();
    setTasks(
      tasks.map((item) =>
        item.id === id
          ? { ...item, done: !item.done }
          : item
      )
    );
  };

  const doneCount = tasks.filter(
    (item) => item.done
  ).length;

  const progress = tasks.length
    ? Math.round((doneCount / tasks.length) * 100)
    : 0;

  const filteredTasks = tasks.filter((item) => {
    const matchSearch = item.title
      .toLowerCase()
      .includes(search.toLowerCase());

    if (filter === 'Active')
      return !item.done && matchSearch;

    if (filter === 'Done')
      return item.done && matchSearch;

    return matchSearch;
  });

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.card },
      ]}
    >
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() => toggleDone(item.id)}
      >
        <Text
          style={[
            styles.taskText,
            { color: theme.text },
            item.done && styles.doneText,
          ]}
        >
          {item.done ? '✅ ' : '⬜ '}
          {item.title}
        </Text>

        <Text
          style={[
            styles.timeText,
            { color: theme.sub },
          ]}
        >
          🕒 {item.createdAt}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => editTask(item)}
        style={styles.iconBtn}
      >
        <Text style={styles.icon}>✏️</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => deleteTask(item.id)}
        style={styles.iconBtn}
      >
        <Text style={styles.icon}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        { backgroundColor: theme.bg },
      ]}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Text
          style={[
            styles.title,
            { color: theme.primary },
          ]}
        >
          📝 MyTaskList
        </Text>

        <TouchableOpacity
          onPress={() =>
            setDarkMode(!darkMode)
          }
        >
          <Text style={styles.modeIcon}>
            {darkMode ? '☀️' : '🌙'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* COUNTER */}
      <Text
        style={[
          styles.counter,
          { color: theme.sub },
        ]}
      >
        {doneCount} completed from{' '}
        {tasks.length} tasks
      </Text>

      {/* PROGRESS */}
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${progress}%`,
              backgroundColor:
                theme.primary,
            },
          ]}
        />
      </View>

      <Text
        style={[
          styles.progressText,
          { color: theme.sub },
        ]}
      >
        {progress}% Completed
      </Text>

      {/* INPUT */}
      <View style={styles.inputRow}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor:
                theme.input,
              color: theme.text,
            },
          ]}
          placeholder="Enter task..."
          placeholderTextColor="#94a3b8"
          value={task}
          onChangeText={setTask}
        />

        <TouchableOpacity
          style={[
            styles.addBtn,
            {
              backgroundColor:
                theme.primary,
            },
          ]}
          onPress={addTask}
        >
          <Text style={styles.addText}>
            {editId ? 'Save' : 'Add'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* SEARCH */}
      <TextInput
        style={[
          styles.search,
          {
            backgroundColor:
              theme.input,
            color: theme.text,
          },
        ]}
        placeholder="Search task..."
        placeholderTextColor="#94a3b8"
        value={search}
        onChangeText={setSearch}
      />

      {/* FILTER */}
      <View style={styles.filterRow}>
        {['All', 'Active', 'Done'].map(
          (item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.filterBtn,
                {
                  backgroundColor:
                    filter === item
                      ? theme.primary
                      : theme.card,
                },
              ]}
              onPress={() =>
                setFilter(item)
              }
            >
              <Text
                style={{
                  color:
                    filter === item
                      ? '#000'
                      : theme.text,
                  fontWeight: 'bold',
                }}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )
        )}
      </View>

      {/* LIST */}
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text
              style={styles.emptyEmoji}
            >
              📭
            </Text>
            <Text
              style={[
                styles.emptyText,
                { color: theme.text },
              ]}
            >
              No task found
            </Text>
            <Text
              style={{
                color: theme.sub,
              }}
            >
              Add your first task 🚀
            </Text>
          </View>
        }
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 55,
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },

  modeIcon: {
    fontSize: 28,
  },

  counter: {
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
  },

  progressBar: {
    height: 10,
    backgroundColor: '#334155',
    borderRadius: 20,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
  },

  progressText: {
    textAlign: 'center',
    marginVertical: 10,
  },

  inputRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },

  input: {
    flex: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
  },

  addBtn: {
    marginLeft: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    borderRadius: 12,
  },

  addText: {
    fontWeight: 'bold',
    color: '#000',
  },

  search: {
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 12,
    height: 48,
  },

  filterRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },

  filterBtn: {
    flex: 1,
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 10,
    alignItems: 'center',
  },

  card: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 14,
    marginBottom: 12,
    alignItems: 'center',
  },

  taskText: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  doneText: {
    textDecorationLine:
      'line-through',
    color: '#94a3b8',
  },

  timeText: {
    fontSize: 11,
    marginTop: 5,
  },

  iconBtn: {
    marginLeft: 10,
  },

  icon: {
    fontSize: 20,
  },

  emptyBox: {
    alignItems: 'center',
    marginTop: 70,
  },

  emptyEmoji: {
    fontSize: 55,
  },

  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
});