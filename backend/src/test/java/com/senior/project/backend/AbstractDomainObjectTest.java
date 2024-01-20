package com.senior.project.backend;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.ReflectionUtils;

/**
 * Uses the reflection utils to automatically run tests on getters, setters, and builders
 */
public abstract class AbstractDomainObjectTest<T> {
    private Logger logger = LoggerFactory.getLogger(getClass());

    private T CuT;
    private Map<String, Object> fieldValueMap;

    @SafeVarargs
    public AbstractDomainObjectTest(T CuT, Pair<String, Object>... pairs) {
        this.CuT = CuT;
        this.fieldValueMap = new HashMap<>();

        for (Pair<String, Object> p : pairs) {
            fieldValueMap.put(p.getKey(), p.getValue());
        }
    }

    @Test
    public void testBuilder() throws IllegalAccessException, IllegalArgumentException, InvocationTargetException {
        Method builderMethod = ReflectionUtils.findMethod(CuT.getClass(), "builder");
        
        if (builderMethod != null) {
            Object builder = builderMethod.invoke(null);
            builder.toString();

            Method[] methods = ReflectionUtils.getAllDeclaredMethods(builder.getClass());
            Method buildMethod = null;
            for (Method m : methods) {
                if (m.getName().equals("build")) buildMethod = m;
                if (!isObjectMethod(m)) {
                    Object value = fieldValueMap.get(m.getName());
                    m.invoke(builder, value);
                }
            }

            assertNotNull(buildMethod);
            Object built = buildMethod.invoke(builder);
            assertEquals(built, CuT);
        }
    }

    @Test
    public void testGetters() throws IllegalAccessException, IllegalArgumentException, InvocationTargetException {
        Method[] methods = ReflectionUtils.getAllDeclaredMethods(CuT.getClass());
        for (Method m : methods) {
            if ((m.getName().startsWith("get") || 
                    m.getName().startsWith("is")) &&
                    !m.getName().equals("getClass")
            ) {
                String fieldName = extractFieldName(m.getName(), "get", "is");
                Object expected = fieldValueMap.get(fieldName);
                Object actual = m.invoke(CuT);

                logger.info("Running " + m.getName() + " test");

                assertEquals(expected.getClass(), actual.getClass());
                assertEquals(expected, actual);
            }
        }
    }

    @Test
    @SuppressWarnings("unchecked")
    public void testSetters() throws InstantiationException, IllegalAccessException, IllegalArgumentException, InvocationTargetException, NoSuchMethodException, SecurityException {
        Method[] methods = ReflectionUtils.getAllDeclaredMethods(CuT.getClass());
        T clone = (T) CuT.getClass().getDeclaredConstructor().newInstance();
        for (Method m : methods) {
            if ((m.getName().startsWith("set"))
            ) {
                String fieldName = extractFieldName(m.getName(), "set");
                Object value = fieldValueMap.get(fieldName);

                logger.info("Running " + m.getName() + " test with argument " + value.toString());

                m.invoke(clone, value);
            }
        }

        assertEquals(CuT, clone);
    }

    @Test
    @SuppressWarnings("unchecked")
    public void ignoreObjectMethods() throws InstantiationException, IllegalAccessException, IllegalArgumentException, InvocationTargetException, NoSuchMethodException, SecurityException {
        CuT.toString();
        CuT.hashCode();
        T clone = (T) CuT.getClass().getDeclaredConstructor().newInstance();
        clone.hashCode();

        assertFalse(CuT.equals(clone));
        assertFalse(CuT.equals(""));
        assertTrue(CuT.equals(CuT));
        assertFalse(CuT.hashCode() == clone.hashCode());
    }

    private String extractFieldName(String mName, String... prefixes) {
        String key = "a";

        for (String prefix : prefixes) {
            if (mName.startsWith(prefix)) {
                key = mName.split(prefix)[1];
                break;
            }
        }

        char[] keyArr = key.toCharArray();
        keyArr[0] = Character.toLowerCase(keyArr[0]);
        key = new String(keyArr);

        return key;
    }

    private boolean isObjectMethod(Method m) {
        String methodName = m.getName();

        if (methodName.equals("$jacocoInit") || methodName.equals("build")) return true;

        Method[] oMethods = ReflectionUtils.getAllDeclaredMethods(Object.class);

        for (Method o : oMethods) {
            if (methodName.equals(o.getName())) {
                return true;
            }
        }

        return false;
    }
}
