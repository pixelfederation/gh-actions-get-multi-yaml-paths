<!-- start title -->

# GitHub Action: Get multi YAML Paths

<!-- end title -->
<!-- start description -->

GitHub Action to get values of multiple paths

<!-- end description -->
<!-- start contents -->
<!-- end contents -->
<!-- start usage -->

```yaml
- uses: pixelfederation/gh-actions-get-multi-yaml-paths@v0.0.0
  id: yaml
  with:
    # YAML file to read
    yamlFile: "test.yaml"

    # Fail if any value is type of undefined (missing/wrong path).
    # Default: true
    failUndefinedValue: false

    # Fail if any value is type of an object and not primitive value.
    # Default: true
    failObjectValue: false

    # Paths to read
    paths: |
      <path.to.value> ;
      <path.to.another.value> | <optional_output_name>;

- run: |
  echo "${{steps.yaml.outputs.value}}"
  echo "${{steps.yaml.outputs.optional_output_name}}"
```

<!-- end usage -->
<!-- start inputs -->

| **Input**                | **Description**                                                 | **Default** | **Required** |
| :----------------------- | :-------------------------------------------------------------- | :---------: | :----------: |
| **`yamlFile`**           | YAML file to read                                               |             |   **true**   |
| **`failUndefinedValue`** | Fail if any value is type of undefined (missing/wrong path).    |   `true`    |  **false**   |
| **`failObjectValue`**    | Fail if any value is type of an object and not primitive value. |   `true`    |  **false**   |
| **`paths`**              | Paths to read                                                   |             |   **true**   |

<!-- end inputs -->
<!-- start outputs -->
<!-- end outputs -->
<!-- start [.github/ghdocs/examples/] -->
<!-- end [.github/ghdocs/examples/] -->
