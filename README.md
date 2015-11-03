# Assignment-4-B

This assignment requires you to draw two time series as line graphs. Similar to the exercise during class, you will use d3's built-in svg generators to create `<path>` elements with the right geometry.

## Creating data with the right structure

The dimensionality problem we discussed in class boils down to this: in drawing two time series for coffee and tea production between 1963 and 2013, we expect to see 2 (two) series of data, with 51 data points each.

However, .csv files can't represent multi-dimensional, nested data structures. The data you initially import is a one-dimensional array with 102 data points, with coffee and tea mixed together like thus:

```
  [
    {item:"Tea",year:1963,value:1021949},
    {item:"Tea",year:1964,value:1063199},
    ...
    {item:"Coffee",year:1963,value:4152127}
  ]
```

Your job is to use `d3.nest()` to create the right structure out of this data, so that it will look like this instead:

```
  [
    {
      key:"Tea",
      values:[
        {item:"Tea",year:1963,value:1021949},
        {item:"Tea",year:1964,value:1063199},
        ...
      ]
    },
  
    {
      key:"Coffee",
      values:[
        {item:"Coffee",year:1963,value:4152127},
        ...
      ]
    }
  ]
```

To emphasize the distinction, the new data contains **1 (one)** top-level array of **2 (two)** objects, with each object in turn containing **1 (one)** array each of 51 data points. Now you are ready to create two `<path>` elements.

For your reference, [this link](http://learnjsdata.com/group_data.html) contains a good tutorial for nesting data.

