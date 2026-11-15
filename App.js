
import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  StatusBar,
  SafeAreaView
} from 'react-native';

export default function App() {

  const nombreAprendiz = 'Wilmer Sanchez';
  const ficha = '3409609';

  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('Análisis');
  const [tareas, setTareas] = useState([]);

  const [alerta, setAlerta] = useState({
    visible: false,
    titulo: '',
    mensaje: '',
    tipo: '',
    id: null
  });

  const mostrarAlerta = (titulo, mensaje, tipo, id = null) => {
    setAlerta({
      visible: true,
      titulo,
      mensaje,
      tipo,
      id
    });
  };

  const cerrarAlerta = () => {
    setAlerta({
      visible: false,
      titulo: '',
      mensaje: '',
      tipo: '',
      id: null
    });
  };

  const agregarTarea = () => {

    if (titulo.trim().length === 0) {
      mostrarAlerta(
        '¡Atención!',
        'No puedes registrar una tarea vacía. Por favor, escribe el nombre de la tarea.',
        'error'
      );
      return;
    }

    const nuevaTarea = {
      id: Date.now().toString() + Math.random().toString(),
      titulo: titulo.trim(),
      categoria: categoria,
      completada: false
    };

    setTareas((actuales) => [...actuales, nuevaTarea]);
    setTitulo('');

    mostrarAlerta(
      '¡Tarea registrada!',
      'La tarea se agregó correctamente.',
      'exito'
    );
  };

  const cambiarEstado = (id) => {

    setTareas((actuales) =>
      actuales.map((tarea) =>
        tarea.id === id
          ? {
              ...tarea,
              completada: !tarea.completada
            }
          : tarea
      )
    );

  };

  const eliminarTarea = (id) => {

    mostrarAlerta(
      'Eliminar tarea',
      '¿Estás seguro de que deseas eliminar esta tarea?',
      'confirmar',
      id
    );

  };

  const confirmarEliminacion = () => {

    const id = alerta.id;

    setTareas((actuales) =>
      actuales.filter((tarea) => tarea.id !== id)
    );

    cerrarAlerta();

  };

  const total = tareas.length;

  const pendientes = tareas.filter(
    (tarea) => !tarea.completada
  ).length;

  const completadas = tareas.filter(
    (tarea) => tarea.completada
  ).length;

  const renderizarTarea = ({ item }) => (

    <View style={styles.tarjetaTarea}>

      <View style={styles.infoTarea}>

        <Text
          style={[
            styles.tituloTarea,
            item.completada && styles.tareaTerminada
          ]}
        >
          {item.titulo}
        </Text>

        <Text style={styles.categoriaTarea}>
          Categoría: {item.categoria}
        </Text>

        <Text
          style={[
            styles.estado,
            item.completada
              ? styles.estadoCompletado
              : styles.estadoPendiente
          ]}
        >
          {item.completada
            ? '✓ Completada'
            : '● Pendiente'}
        </Text>

      </View>

      <View style={styles.botonesTarea}>

        <TouchableOpacity
          style={styles.botonEstado}
          onPress={() => cambiarEstado(item.id)}
        >
          <Text style={styles.textoBoton}>
            {item.completada ? 'Pendiente' : 'Completar'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botonEliminar}
          onPress={() => eliminarTarea(item.id)}
        >
          <Text style={styles.textoBoton}>
            Eliminar
          </Text>
        </TouchableOpacity>

      </View>

    </View>
  );

  return (

    <SafeAreaView style={styles.contenedor}>

      <StatusBar
        backgroundColor="#142D4E"
        barStyle="light-content"
      />

      <FlatList
        data={tareas}
        keyExtractor={(item) => item.id}
        renderItem={renderizarTarea}

        ListHeaderComponent={

          <View>

            <View style={styles.encabezado}>

              <Text style={styles.tituloApp}>
                MI SPRINT ADSO
              </Text>

              <Text style={styles.subtitulo}>
                Organiza tus tareas y alcanza tus metas
              </Text>

              <View style={styles.datosAprendiz}>

                <Text style={styles.textoAprendiz}>
                  Aprendiz: {nombreAprendiz}
                </Text>

                <Text style={styles.textoAprendiz}>
                  Ficha: {ficha}
                </Text>

              </View>

            </View>

            <Text style={styles.tituloSeccion}>
              Resumen de avance
            </Text>

            <View style={styles.resumen}>

              <View style={styles.tarjetaResumen}>
                <Text style={styles.numeroResumen}>{total}</Text>
                <Text style={styles.textoResumen}>Total</Text>
              </View>

              <View style={styles.tarjetaResumen}>
                <Text style={styles.numeroResumen}>{pendientes}</Text>
                <Text style={styles.textoResumen}>Pendientes</Text>
              </View>

              <View style={styles.tarjetaResumen}>
                <Text style={styles.numeroResumen}>{completadas}</Text>
                <Text style={styles.textoResumen}>Completadas</Text>
              </View>

            </View>

            <Text style={styles.tituloSeccion}>
              Registrar nueva tarea
            </Text>

            <View style={styles.formulario}>

              <Text style={styles.etiqueta}>
                Nombre de la tarea
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Ej. Diseñar pantalla principal"
                value={titulo}
                onChangeText={setTitulo}
              />

              <Text style={styles.etiqueta}>
                Selecciona una categoría
              </Text>

              <View style={styles.categorias}>

                {['Análisis', 'Diseño', 'Código'].map((item) => (

                  <TouchableOpacity
                    key={item}
                    style={[
                      styles.botonCategoria,
                      categoria === item && styles.categoriaSeleccionada
                    ]}
                    onPress={() => setCategoria(item)}
                  >

                    <Text
                      style={[
                        styles.textoCategoria,
                        categoria === item && styles.textoCategoriaSeleccionada
                      ]}
                    >
                      {item}
                    </Text>

                  </TouchableOpacity>

                ))}

              </View>

              <TouchableOpacity
                style={styles.botonAgregar}
                onPress={agregarTarea}
              >
                <Text style={styles.textoAgregar}>
                  + Agregar tarea
                </Text>
              </TouchableOpacity>

            </View>

            <Text style={styles.tituloSeccion}>
              Mis tareas
            </Text>

            {tareas.length === 0 && (

              <Text style={styles.mensajeVacio}>
                Todavía no tienes tareas registradas.
                ¡Agrega tu primera tarea!
              </Text>

            )}

          </View>
        }

        ListFooterComponent={

          <View style={styles.pie}>

            <Text style={styles.textoPie}>
              SENA | ADSO | Ficha 3409609
            </Text>

            <Text style={styles.textoPie}>
              Mi Sprint ADSO © 2026
            </Text>

          </View>
        }

        contentContainerStyle={styles.lista}
      />

      {alerta.visible && (

        <View style={styles.fondoAlerta}>

          <View style={styles.ventanaAlerta}>

            <Text style={styles.iconoAlerta}>
              {alerta.tipo === 'error'
                ? '⚠️'
                : alerta.tipo === 'confirmar'
                ? '🗑️'
                : '✓'}
            </Text>

            <Text style={styles.tituloAlerta}>
              {alerta.titulo}
            </Text>

            <Text style={styles.mensajeAlerta}>
              {alerta.mensaje}
            </Text>

            {alerta.tipo === 'confirmar' ? (

              <View style={styles.botonesAlerta}>

                <TouchableOpacity
                  style={styles.botonCancelar}
                  onPress={cerrarAlerta}
                >
                  <Text style={styles.textoBotonAlerta}>
                    Cancelar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.botonConfirmar}
                  onPress={confirmarEliminacion}
                >
                  <Text style={styles.textoBotonAlerta}>
                    Eliminar
                  </Text>
                </TouchableOpacity>

              </View>

            ) : (

              <TouchableOpacity
                style={styles.botonAceptar}
                onPress={cerrarAlerta}
              >
                <Text style={styles.textoBotonAlerta}>
                  Entendido
                </Text>
              </TouchableOpacity>

            )}

          </View>

        </View>

      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  contenedor: {
    flex: 1,
    backgroundColor: '#F1F5F9'
  },

  lista: {
    paddingBottom: 25
  },

  encabezado: {
    backgroundColor: '#142D4E',
    padding: 25,
    paddingTop: 35,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25
  },

  tituloApp: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center'
  },

  subtitulo: {
    color: '#CBD5E1',
    textAlign: 'center',
    marginTop: 8,
    fontSize: 13
  },

  datosAprendiz: {
    marginTop: 20,
    backgroundColor: '#24466F',
    padding: 12,
    borderRadius: 10
  },

  textoAprendiz: {
    color: '#FFFFFF',
    fontSize: 14,
    marginVertical: 3
  },

  tituloSeccion: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#142D4E',
    marginHorizontal: 18,
    marginTop: 25,
    marginBottom: 12
  },

  resumen: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 12
  },

  tarjetaResumen: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    elevation: 2
  },

  numeroResumen: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#2563EB'
  },

  textoResumen: {
    color: '#475569',
    fontSize: 12,
    marginTop: 5
  },

  formulario: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    padding: 18,
    borderRadius: 15,
    elevation: 2
  },

  etiqueta: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 8
  },

  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 9,
    padding: 12,
    marginBottom: 18,
    fontSize: 14
  },

  categorias: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },

  botonCategoria: {
    borderWidth: 1,
    borderColor: '#2563EB',
    borderRadius: 8,
    padding: 10,
    flex: 1,
    marginHorizontal: 3,
    alignItems: 'center'
  },

  categoriaSeleccionada: {
    backgroundColor: '#2563EB'
  },

  textoCategoria: {
    color: '#2563EB',
    fontWeight: 'bold',
    fontSize: 12
  },

  textoCategoriaSeleccionada: {
    color: '#FFFFFF'
  },

  botonAgregar: {
    backgroundColor: '#2563EB',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },

  textoAgregar: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16
  },

  tarjetaTarea: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2
  },

  infoTarea: {
    flex: 1,
    paddingRight: 8
  },

  tituloTarea: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B'
  },

  tareaTerminada: {
    textDecorationLine: 'line-through',
    color: '#94A3B8'
  },

  categoriaTarea: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 5
  },

  estado: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 7
  },

  estadoPendiente: {
    color: '#D97706'
  },

  estadoCompletado: {
    color: '#16A34A'
  },

  botonesTarea: {
    alignItems: 'flex-end'
  },

  botonEstado: {
    backgroundColor: '#2563EB',
    padding: 8,
    borderRadius: 7,
    marginBottom: 6
  },

  botonEliminar: {
    backgroundColor: '#DC2626',
    padding: 8,
    borderRadius: 7
  },

  textoBoton: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold'
  },

  mensajeVacio: {
    textAlign: 'center',
    color: '#64748B',
    marginHorizontal: 20,
    marginVertical: 25,
    fontSize: 14
  },

  pie: {
    alignItems: 'center',
    marginTop: 30,
    padding: 15
  },

  textoPie: {
    color: '#94A3B8',
    fontSize: 12,
    marginVertical: 3
  },

  fondoAlerta: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
    zIndex: 100
  },

  ventanaAlerta: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    borderRadius: 18,
    padding: 25,
    alignItems: 'center',
    elevation: 10
  },

  iconoAlerta: {
    fontSize: 38,
    marginBottom: 12
  },

  tituloAlerta: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#142D4E',
    marginBottom: 12,
    textAlign: 'center'
  },

  mensajeAlerta: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 22
  },

  botonesAlerta: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between'
  },

  botonCancelar: {
    backgroundColor: '#64748B',
    padding: 13,
    borderRadius: 9,
    flex: 1,
    marginRight: 6,
    alignItems: 'center'
  },

  botonConfirmar: {
    backgroundColor: '#DC2626',
    padding: 13,
    borderRadius: 9,
    flex: 1,
    marginLeft: 6,
    alignItems: 'center'
  },

  botonAceptar: {
    backgroundColor: '#2563EB',
    padding: 13,
    borderRadius: 9,
    width: '100%',
    alignItems: 'center'
  },

  textoBotonAlerta: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14
  }

});
