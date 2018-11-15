# CDRPAR
Concern-Driven Reporting of Performance Analysis Results (Bachelor's Thesis)

## User Concern Format

```json
{
    query:    {
        text:        "",
        type:        "",
        parameters:  {},
        format:      "",
        target:      "",
        contstraint: ""
    },
    type:     "",
    analysis: {
        tool:   "",
        expert: false,
        meta:   {}
    }
}
```

## Supported Analysis Tools

- JMeter
- Locust
