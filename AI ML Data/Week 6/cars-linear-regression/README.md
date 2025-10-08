# Predicting used car prices using Linear Regression

This repo is part of a beginner level course on Machine Learning using Scikit Learn.

## Exercise

First run the notebook as given to see if it loads the data correctly, after that continue with the exercise below. For this exercise you may need to refer to the scikit-learn documentation on [Linear Regression](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LinearRegression.html).

Start with doing the first two exercises below only for the second model (using only three features) in the notebook. Later on you can compare with the first model.

### Plot the residuals

Linear regression has a couple of important assumptions about the data. An important one is that the residues are normally distributed. Can you explain why this is important? What happens when the residuals are not normally distributed and why could linear regression give incorrect results? 

The residuals are the difference between the test data and the predicted values by the linear regression model. You can use the function [Seaborn residplot](https://seaborn.pydata.org/generated/seaborn.residplot.html) and [Seaborn histplot](https://seaborn.pydata.org/generated/seaborn.histplot.html) to plot the residuals. It helps to display a smooth curve in the histogram to inspect the distribution more clearly, which you can achieve by passing a certain argument to the histplot function. Based on these graphs, do you think the residuals are normally distributed?

**Bonus:** Looking at a graph to determine whether data is normally distributed is somewhat subjective. There are other methods: The [Q-Q plot](https://www.geeksforgeeks.org/qqplot-quantile-quantile-plot-in-python/) provides a better graphical way to determine whether data is normally distributed. A more objective normality tests is the [Shapiro-Wilk test](https://www.geeksforgeeks.org/how-to-perform-a-shapiro-wilk-test-in-python/).

### Explainability

Our linear regression model might give some decent predictions, but it is not directly clear which features were more important when determining the price of a car. Try to explain your model by inspecting the coefficients of the linear regression model.  You can get these from the model object itself. 

Why would the coefficients themselves not be a good method to explain the regression model? What happens when we would change the unit of a certain feature (for instance, we do not measure length in meters but in millimeters)?

Recently there has been more research into explainability of AI; one of the latest innovations in this field is [SHAP values](https://shap.readthedocs.io/en/latest/example_notebooks/overviews/An%20introduction%20to%20explainable%20AI%20with%20Shapley%20values.html#Explaining-an-additive-regression-model). First read the sections "An introduction to explainable AI with Shapley values", "Examining the model coefficients" and "Explaining an additive regression model" and see whether you understand the material. Then use the SHAP library and try to explain your model by plotting for instance a beeswarm plot.
 
### Compare models

The notebook contains two models: One using eight features and one using only three features. Repeat the exercises above for the model using eight features and compare the results. Which model describes the data better?